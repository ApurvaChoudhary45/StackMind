import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
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

        // Get all the notes from the database
        const { data: notes } = await supabase
            .from('notes')
            .select('id')
            .eq('user_id', user.id)

        if (!notes) return NextResponse.json({ error: 'No notes found. Create a new note in StackMind first.' }, { status: 400 })


        return NextResponse.json({ success: true, notes})

    } catch (error) {
        console.error('Unable to find a note:', error)
        return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 })
    }
}