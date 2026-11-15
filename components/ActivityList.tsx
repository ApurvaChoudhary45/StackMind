import type { Activity } from '@/lib/activity'

const icons: Record<string, string> = {
    project: 'ti-folder', note: 'ti-notebook', bug: 'ti-bug', snippet: 'ti-code',
    journal: 'ti-notes', github: 'ti-brand-github', subscription: 'ti-crown',
    ai: 'ti-sparkles', account: 'ti-user-circle', settings: 'ti-settings', search: 'ti-search',
}
const actions: Record<string, string> = {
    requested: 'Requested', created: 'Created', updated: 'Updated', deleted: 'Deleted', status_changed: 'Changed status',
    connected: 'Connected', disconnected: 'Disconnected', used: 'Used', signed_in: 'Signed in',
    signed_out: 'Signed out', saved: 'Saved', copied: 'Copied', searched: 'Searched',
}

export default function ActivityList({ events, compact = false }: { events: Activity[]; compact?: boolean }) {
    if (!events.length) return (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <i className="ti ti-history text-3xl text-text-muted" aria-hidden="true" />
            <p className="mt-3 font-semibold">No activity yet</p>
            <p className="mt-1 text-sm text-text-text-muted">Your workspace activity will appear here.</p>
        </div>
    )
    return (
        <ol className={compact ? 'space-y-2' : 'space-y-3'}>
            {events.map(event => (
                <li key={event.id} className={`flex flex-wrap items-start border border-border bg-card ${compact ? 'gap-2.5 rounded-lg px-3 py-2.5' : 'gap-3 rounded-xl p-4 sm:gap-4 sm:p-5'}`}>
                    <span className={`flex shrink-0 items-center justify-center bg-green-500/10 text-text-muted ${compact ? 'size-8 rounded-lg' : 'size-10 rounded-xl'}`}>
                        <i className={'ti ' + (icons[event.entity_type] ?? 'ti-activity') + (compact ? ' text-base' : ' text-xl')} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className={compact ? 'text-[11px] leading-4 text-text-text-muted' : 'text-xs font-medium text-text-text-muted'}>
                            {actions[event.action] ?? event.action} &middot; {event.entity_type}
                        </p>
                        <p className={`break-words font-semibold text-foreground ${compact ? 'text-sm leading-5' : 'mt-1'}`}>{event.title}</p>
                        {event.project_name && <p className={compact ? 'break-words text-xs leading-4 text-text-muted' : 'mt-1 break-words text-sm text-text-muted'}>{event.project_name}</p>}
                        {event.details && <p className="mt-1 break-words text-xs text-text-text-muted">{event.details.replaceAll('_', ' ')}</p>}
                    </div>
                    <time dateTime={event.created_at} className={compact ? 'ml-auto text-[11px] leading-4 text-text-text-muted' : 'text-xs leading-5 text-text-text-muted'}>
                        {new Date(event.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC
                    </time>
                </li>
            ))}
        </ol>
    )
}
