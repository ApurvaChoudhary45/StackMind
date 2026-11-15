import { sanitizeNoteHtml } from '@/lib/note-html'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { embedText } from '@/lib/embedding'
import { setupCollection, storeVectors } from '@/lib/qdrant'

export async function PUT(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { noteId, title, content } = await req.json().catch(() => null) ?? {}
        if (typeof noteId !== 'string' || typeof title !== 'string' || !title.trim() || typeof content !== 'string') {
            return NextResponse.json({ error: 'A note ID, title, and content are required.' }, { status: 400 })
        }

        const { data: note, error } = await supabase.from('notes')
            .update({ title, content: sanitizeNoteHtml(content) })
            .eq('id', noteId)
            .eq('user_id', user.id)
            .select('id, project_id, content')
            .maybeSingle()
        if (error) throw error
        if (!note) return NextResponse.json({ error: 'Note not found.' }, { status: 404 })

        try {
            const vector = await embedText(title + ' ' + content)
            await setupCollection()
            await storeVectors([{
                id: note.id,
                vector,
                payload: { noteId: note.id, title, content, projectId: note.project_id, userId: user.id },
            }])
        } catch (error) {
            console.error('Note updated but indexing failed:', error)
        }

        return NextResponse.json({ success: true, content: note.content })
    } catch (error) {
        console.error('Failed to update note:', error)
        return NextResponse.json({ error: 'Failed to update note.' }, { status: 500 })
    }
}
