import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
    try {
        // Get token from Authorization header
        const token = req.headers.get('Authorization')?.replace('Bearer ', '')
        if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 })

        // Verify token + get user via Supabase
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { global: { headers: { Authorization: `Bearer ${token}` } } }
        )

        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        const { title, code, language } = await req.json()

        // Get user's first project to save snippet to
        const { data: project } = await supabase
            .from('projects')
            .select('id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (!project) return NextResponse.json({ error: 'No project found. Create a project in StackMind first.' }, { status: 400 })

        // Save snippet
        const { error: insertError } = await supabase
            .from('snippets')
            .insert({
                title,
                code,
                language,
                project_id: project.id,
                user_id: user.id
            })

        if (insertError) throw new Error(insertError.message)

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('VS Code snippet save error:', error)
        return NextResponse.json({ error: 'Failed to save snippet' }, { status: 500 })
    }
}