
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NoteSection from "@/components/NoteSection";


export default async function NotesPage({params}: {params : {id : string}}) {

    const supabase = await createClient()
    const {data : {user}} = await supabase.auth.getUser()
    if (!user) redirect('/login')
    
    const {id} = await params
    const {data : project} = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()



    const {data : notes, error: notesError} = await supabase
    .from('notes')
    .select('*')
    .eq('project_id', id)
    .order('created_at', {ascending : false})

    if (notesError) throw new Error(notesError.message)


  return (
    <NoteSection project={project} notes={notes ?? []} userId={user.id}/>
  )
}

