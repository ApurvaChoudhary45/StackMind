import { deleteDocumentVectors } from '@/lib/qdrant'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'


export async function DELETE(req: NextRequest) {
    try {
        const { noteId } = await req.json()

        console.log(noteId)

        const supabase = await createClient()

        const { error } = await supabase.from('notes').delete().eq('id', noteId)

        if (error) throw new Error(error.message)

        // await deleteDocumentVectors(noteId)

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Failed to delete note:', error)
        return NextResponse.json(
            { error: 'Failed to create note' },
            { status: 500 }
        )
    }
}