import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deleteDocumentVectors } from '@/lib/qdrant'

export async function deleteOwnedRecord(
    request: Request,
    table: 'projects' | 'notes' | 'snippets',
    idKey: 'projectId' | 'noteId' | 'snippetId'
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => null)
    const id = body?.[idKey]
    if (typeof id !== 'string' || !id.trim()) {
        return NextResponse.json({ error: 'An ID is required.' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('user_id', user.id)
        .eq('id', id)
        .select('id')
        .maybeSingle()

    if (error) return NextResponse.json({ error: 'Could not delete this record.' }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Record not found.' }, { status: 404 })

    if (table !== 'projects') {
        await deleteDocumentVectors(id).catch(() => {
            // Search checks that the corresponding database row still exists.
        })
    }

    return NextResponse.json({ success: true })
}
