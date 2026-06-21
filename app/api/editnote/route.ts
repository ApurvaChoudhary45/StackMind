// import { createClient } from '@/lib/supabase/server'
// import { NextRequest, NextResponse } from 'next/server'
// import { embedText } from '@/lib/embedding'
// import { storeVectors } from '@/lib/qdrant'

// export async function PUT(req: NextRequest) {
//     try {
//         const { noteId, title, content, projectId, userId } = await req.json()

//         const supabase = createClient()

//         // Step 1 — Update in Supabase
//         const { error } = await supabase
//             .from('notes')
//             .update({ title, content })
//             .eq('id', noteId)

//         if (error) throw new Error(error.message)

//         // Step 2 — Re-embed updated content
//         const vector = await embedText(`${title} ${content}`)

//         // Step 3 — Upsert to Qdrant (replaces old vector)
//         await storeVectors([{
//             id: noteId,
//             vector,
//             payload: {
//                 noteId,
//                 title,
//                 content,
//                 projectId,
//                 userId
//             }
//         }])

//         return NextResponse.json({ success: true })

//     } catch (error) {
//         console.error('Failed to update note:', error)
//         return NextResponse.json(
//             { error: 'Failed to update note' },
//             { status: 500 }
//         )
//     }
// }