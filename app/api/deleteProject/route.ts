import { deleteDocumentVectors } from '@/lib/qdrant'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'


export async function DELETE(req: NextRequest) {
    try {
        const { projectId } = await req.json()

        const supabase = await createClient()

        const { error } = await supabase.from('projects').delete().eq('id', projectId)

        if (error) throw new Error(error.message)

        // await deleteDocumentVectors(noteId)

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Failed to delete snippet:', error)
        return NextResponse.json(
            { error: 'Failed to create snippet' },
            { status: 500 }
        )
    }
}