begin;

create table if not exists public.activity_events (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    action text not null,
    entity_type text not null,
    entity_id text,
    title text not null,
    project_name text,
    details text,
    created_at timestamptz not null default now(),
    source_key text unique
);
create index if not exists activity_events_user_date_idx
    on public.activity_events(user_id, created_at desc, id desc);
alter table public.activity_events enable row level security;
revoke all on public.activity_events from anon, authenticated;
grant select on public.activity_events to authenticated;
grant all on public.activity_events to service_role;
drop policy if exists activity_read_own on public.activity_events;
create policy activity_read_own on public.activity_events for select to authenticated
    using ((select auth.uid()) = user_id);

-- Capture writes from browser clients, API routes, CLI, and extension together.
-- Only labels and changed field names are retained, never tokens or note/code bodies.
create or replace function public.capture_stackmind_activity()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
    row_data jsonb;
    previous_data jsonb;
    owner_id uuid;
    kind text;
    event_title text;
    project_label text;
    event_action text;
    event_details text;
    changed_fields text[];
begin
    row_data := case when TG_OP = 'DELETE' then to_jsonb(OLD) else to_jsonb(NEW) end;
    owner_id := (row_data->>'user_id')::uuid;
    -- During account deletion the parent auth record may already be gone.
    if owner_id is null or not exists(select 1 from auth.users where id = owner_id) then
        return null;
    end if;
    kind := case TG_TABLE_NAME
        when 'projects' then 'project' when 'notes' then 'note'
        when 'bugs' then 'bug' when 'snippets' then 'snippet'
        when 'journal_entries' then 'journal' when 'github_tokens' then 'github'
        when 'subscriptions' then 'subscription' end;
    event_action := case TG_OP when 'INSERT' then 'created' when 'UPDATE' then 'updated' else 'deleted' end;
    event_title := coalesce(nullif(row_data->>'title', ''), nullif(row_data->>'name', ''),
        case kind when 'github' then 'GitHub connection' when 'subscription' then 'Subscription'
        when 'journal' then 'Journal entry ' || coalesce(row_data->>'date', '') else 'Untitled ' || kind end);
    if kind = 'project' then
        project_label := row_data->>'name';
    elsif row_data->>'project_id' is not null then
        select name into project_label from public.projects where id::text = row_data->>'project_id';
    end if;
    if TG_OP = 'UPDATE' then
        previous_data := to_jsonb(OLD);
        select array_agg(field order by field) into changed_fields
        from jsonb_object_keys(row_data) as keys(field)
        where row_data->field is distinct from previous_data->field
          and field = any(case kind
            when 'subscription' then array['plan','status','cancel_at_period_end']
            when 'github' then array[]::text[]
            else array['title','name','content','code','description','language','status','priority','tags','summary','project_id'] end);
        if changed_fields is null then return null; end if;
        event_details := 'Changed ' || array_to_string(changed_fields, ', ');
        if kind = 'bug' and row_data->>'status' is distinct from previous_data->>'status' then
            event_action := 'status_changed';
            event_details := coalesce(previous_data->>'status', 'unknown') || ' -> ' || coalesce(row_data->>'status', 'unknown');
        end if;
    end if;
    if kind = 'github' then
        event_action := case TG_OP when 'INSERT' then 'connected' else 'disconnected' end;
    end if;
    insert into public.activity_events(user_id, action, entity_type, entity_id, title, project_name, details)
    values(owner_id, event_action, kind, coalesce(row_data->>'id', owner_id::text), event_title, project_label, event_details);
    return null;
end;
$$;
revoke all on function public.capture_stackmind_activity() from public, anon, authenticated;

do $$
declare table_name text;
begin
    foreach table_name in array array['projects','notes','bugs','snippets','journal_entries','github_tokens','subscriptions']
    loop
        if to_regclass('public.' || table_name) is not null then
            execute format('drop trigger if exists stackmind_activity on public.%I', table_name);
            execute format('create trigger stackmind_activity after insert or update or delete on public.%I for each row execute function public.capture_stackmind_activity()', table_name);
        end if;
    end loop;
end;
$$;

-- Existing creation timestamps can be recovered; earlier edits/deletes cannot.
do $$
declare table_name text; kind text;
begin
    foreach table_name in array array['projects','notes','bugs','snippets']
    loop
        kind := case table_name when 'projects' then 'project' when 'notes' then 'note' when 'bugs' then 'bug' else 'snippet' end;
        execute format($query$
            insert into public.activity_events(user_id, action, entity_type, entity_id, title, project_name, created_at, source_key)
            select r.user_id, 'created', %L, r.id::text,
                coalesce(nullif(to_jsonb(r)->>'title',''), nullif(to_jsonb(r)->>'name',''), 'Untitled ' || %L),
                case when %L = 'project' then to_jsonb(r)->>'name' else p.name end,
                r.created_at, %L || r.id::text
            from public.%I r
            left join public.projects p on p.id::text = to_jsonb(r)->>'project_id'
            where r.created_at is not null
                and not exists (
                    select 1 from public.activity_events existing
                    where existing.user_id = r.user_id and existing.entity_type = %L
                      and existing.entity_id = r.id::text and existing.action = 'created'
                )
            on conflict(source_key) do nothing
        $query$, kind, kind, kind, 'backfill:' || table_name || ':', table_name, kind);
    end loop;
end;
$$;
do $$
begin
    if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
       and not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime'
                       and schemaname = 'public' and tablename = 'activity_events') then
        alter publication supabase_realtime add table public.activity_events;
    end if;
end;
$$;
commit;
