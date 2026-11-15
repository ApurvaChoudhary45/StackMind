import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export type Activity = {
    id: string
    action: string
    entity_type: string
    title: string
    project_name: string | null
    details: string | null
    created_at: string
}

export async function recordActivity(userId: string, action: string, entityType: string, title: string) {
    try {
        const { error } = await createAdminClient().from('activity_events').insert({
            user_id: userId, action, entity_type: entityType, title,
        })
        if (error) console.error('Activity could not be recorded:', error.code)
    } catch {
        console.error('Activity could not be recorded')
    }
}

export async function getActivity(userId: string, page = 1, pageSize = 20) {
    const supabase = await createClient()
    const offset = (page - 1) * pageSize
    const { data, error, count } = await supabase.from('activity_events')
        .select('id, action, entity_type, title, project_name, details, created_at', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false }).order('id', { ascending: false })
        .range(offset, offset + pageSize - 1)

    if (!error) return { events: data as Activity[], total: count ?? 0, setupRequired: false }
    if (error.code !== 'PGRST205' && error.code !== '42P01') throw error

    // Keep existing history available until the migration has been applied.
    const tables = ['projects', 'notes', 'bugs', 'snippets'] as const
    const creations = await Promise.all(tables.map(async table => {
        const result = await supabase.from(table)
            .select(table === 'projects' ? 'id, name, created_at' : 'id, title, created_at', { count: 'exact' })
            .eq('user_id', userId).order('created_at', { ascending: false })
            .order('id', { ascending: false }).range(0, offset + pageSize - 1)
        if (result.error) throw result.error
        const events = (result.data as unknown as { id: string; title?: string; name?: string; created_at: string }[]).map(row => ({
            id: table + ':' + row.id, action: 'created', entity_type: table.slice(0, -1),
            title: row.title || row.name || 'Untitled', project_name: null, details: null, created_at: row.created_at,
        }))
        return { events, total: result.count ?? 0 }
    }))
    const events = creations.flatMap(result => result.events).sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id.localeCompare(a.id))
    return { events: events.slice(offset, offset + pageSize), total: creations.reduce((total, result) => total + result.total, 0), setupRequired: true }
}
