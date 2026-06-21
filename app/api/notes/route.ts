import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { embedText } from '@/lib/embedding'
import { storeVectors, setupCollection } from '@/lib/qdrant'

export async function POST(req: NextRequest) {
    try {
        const { title, content, projectId, userId } = await req.json()

        const supabase = await createClient()

        // Step 1 — Save to Supabase first
        const { data: note, error } = await supabase.from('notes')
            .insert({
                title,
                content,
                project_id: projectId,
                user_id: userId
            })
            .select()
            .single()

        if (error) throw new Error(error.message)

        // Step 2 — Embed the note
        const textToEmbed = `${title} ${content}`
        const vector = await embedText(textToEmbed)

        // Step 3 — Store in Qdrant
        await setupCollection()
        await storeVectors([{
            id: note.id,
            vector,
            payload: {
                noteId: note.id,
                title: note.title,
                content: note.content,
                projectId: projectId,
                userId: userId
            }
        }])

        return NextResponse.json({ success: true, note })

    } catch (error) {
        console.error('Failed to create note:', error)
        return NextResponse.json(
            { error: 'Failed to create note' },
            { status: 500 }
        )
    }
}