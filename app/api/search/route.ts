import { recordActivity } from '@/lib/activity'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const query = new URL(request.url).searchParams.get('q')?.trim()
    if (!query) return NextResponse.json({ result: [] })

    const matches = await Promise.all(
        (['notes', 'bugs', 'snippets'] as const).map(async table => {
            const { data, error } = await supabase.from(table)
                .select('id, title, project_id')
                .eq('user_id', user.id)
                .ilike('title', '%' + query.replace(/[\\%_]/g, char => '\\' + char) + '%')
                .limit(20)
            if (error) throw error
            return data.map(item => ({ ...item, type: table.slice(0, -1) }))
        })
    ).catch(error => {
        console.error('Could not search workspace:', error)
        return null
    })

    if (!matches) return NextResponse.json({ error: 'Search failed.' }, { status: 500 })
    await recordActivity(user.id, 'searched', 'search', 'Searched workspace')
    return NextResponse.json({ result: matches.flat() })
}
