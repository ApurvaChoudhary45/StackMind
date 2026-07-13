import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { embedText } from '@/lib/embedding'
import { storeVectors, searchVectors } from '@/lib/qdrant'

import { setupCollection } from '@/lib/qdrant'
export async function PUT(req: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: 'Invalid User' }, { status: 401 });
    }

    try {
        const { title, code, language, description, project_id, user_id, newNoteId } = await req.json()

        if (!title?.trim() || !code?.trim()) {
            return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
        }


        const { data, error } = await supabase.from('snippets').upsert({
            id: newNoteId,
            title,
            code,
            language,
            description,
            project_id,
            user_id
        }).select('id');

        if (error) throw error

        const textToEmbed = `${title}\n${description}\n${code}`

        const vector = await embedText(textToEmbed)

        const snippetId = data?.[0]?.id || newNoteId

        // Step 4 — Store in Qdrant
        await setupCollection()
        await storeVectors([{
            id: snippetId,
            vector,
            payload: {
                noteId: newNoteId,
                title: title,
                content: code,
                projectId : project_id,
                userId: user_id
            }
        }])

        return NextResponse.json({ message: newNoteId ? 'Snippet Updated Successfully' : 'Snippet Inserted Successfully' }, { status: newNoteId ? 201 : 200 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Failed to add snippet.' }, { status: 500 })
    }
}