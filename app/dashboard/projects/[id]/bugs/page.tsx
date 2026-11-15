
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import KanbanBoard from "@/components/KanbanBoard";


export default async function BugsPage({params} : {params: Promise<{ id: string }>}) {

    const {id} = await params
    const supabase = await createClient()

    const {data : {user}} = await supabase.auth.getUser()

    if(!user) redirect('/Login')

    
    const { data: project, error: projectError } = await supabase.from('projects')
        .select('id, name').eq('id', id).eq('user_id', user.id).maybeSingle()
    if (projectError) throw projectError
    if (!project) notFound()

    const {data : bugs, error: bugsError} = await supabase.from('bugs').select('*').eq('project_id', id).eq('user_id', user.id).order('created_at', {ascending : false})
    if(bugsError) throw new Error(bugsError.message)
  return (
    <KanbanBoard
      bugs={bugs ?? []}
      projectId={id}
      userId={user.id}
    />
  )
}
