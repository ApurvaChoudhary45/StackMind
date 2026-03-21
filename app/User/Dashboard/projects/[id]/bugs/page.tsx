
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/KanbanBoard";


export default async function BugsPage({params} : {params : {id : string}}) {

    const {id} = await params
    const supabase = await createClient()

    const {data : {user}} = await supabase.auth.getUser()

    if(!user) redirect('/Login')

    
    const {data : bugs, error: bugsError} = await supabase.from('bugs').select('*').eq('project_id', id).order('created_at', {ascending : false})
    if(bugsError) throw new Error(bugsError.message)
  return (
    <div>
      <KanbanBoard
      bugs={bugs ?? []}
      projectId={id}
      userId={user.id}
    />
    </div>
  )
}
