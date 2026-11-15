import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { embedText } from '@/lib/embedding'
import { setupCollection, storeVectors } from '@/lib/qdrant'
import { canCreateSnippet } from '@/lib/limit'
export async function PUT(req: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json().catch(() => null)
        const { title, code, language, description, project_id, newNoteId } = body ?? {}
        if (typeof title !== 'string' || !title.trim() || typeof code !== 'string' || !code.trim() ||
            typeof project_id !== 'string' || (newNoteId !== undefined && typeof newNoteId !== 'string')) {
            return NextResponse.json({ error: 'A title, code, and project are required.' }, { status: 400 })
        }

        const { data: project, error: projectError } = await supabase.from('projects')
            .select('id').eq('id', project_id).eq('user_id', user.id).maybeSingle()
        if (projectError) throw projectError
        if (!project) return NextResponse.json({ error: 'Project not found.' }, { status: 404 })

        const limit = newNoteId ? { allowed: true, reason: undefined } : await canCreateSnippet(user.id)

        if (!limit.allowed) {
            return NextResponse.json({ error: limit.reason, upgrade: true }, { status: 403 })
        }

        const values = { title, code, language, description, project_id, user_id: user.id }
        const mutation = newNoteId
            ? supabase.from('snippets').update(values)
                .eq('id', newNoteId).eq('user_id', user.id).eq('project_id', project_id)
            : supabase.from('snippets').insert(values)
        const { data, error } = await mutation.select('id').maybeSingle()
        if (error) throw error
        if (!data) return NextResponse.json({ error: 'Snippet not found.' }, { status: 404 })

        try {
            const textToEmbed = `${title}\n${description}\n${code}`

            const vector = await embedText(textToEmbed)

            const snippetId = data.id

            // Step 4 — Store in Qdrant
            await setupCollection()
            await storeVectors([{
                id: snippetId,
                vector,
                payload: {
                    noteId: snippetId,
                    title: title,
                    content: code,
                    projectId: project_id,
                    userId: user.id
                }
            }])
        } catch (error) {
            console.error('Snippet saved but indexing failed:', error)
        }

        return NextResponse.json({ message: newNoteId ? 'Snippet Updated Successfully' : 'Snippet Inserted Successfully' }, { status: newNoteId ? 201 : 200 });

    } catch (error) {
        console.error('Could not save snippet:', error)
        return NextResponse.json({ error: 'Failed to save snippet.' }, { status: 500 })
    }
}