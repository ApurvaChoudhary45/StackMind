import { sanitizeNoteHtml } from '@/lib/note-html'

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import NoteSection from "@/components/NoteSection";


export default async function NotesPage({params}: {params: Promise<{ id: string }>}) {

    const supabase = await createClient()
    const {data : {user}} = await supabase.auth.getUser()
    if (!user) redirect('/Login')
    
    const {id} = await params
    const { data: project, error: projectError } = await supabase.from('projects')
        .select('id, name').eq('id', id).eq('user_id', user.id).maybeSingle()
    if (projectError) throw projectError
    if (!project) notFound()

    const {data : notes, error: notesError} = await supabase
    .from('notes')
    .select('*')
    .eq('project_id', id).eq('user_id', user.id)
    .order('created_at', {ascending : false})

    if (notesError) throw new Error(notesError.message)


  return (
    <NoteSection project={project} notes={(notes ?? []).map(note => ({ ...note, content: sanitizeNoteHtml(note.content) }))} userId={user.id}/>
  )
}

