
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SnippetLibrary from "@/components/SnippetLibrary";

export default async function SnippetPage({params} : {params : {id : string}}) {
    
    const supabase = await createClient()
    const {id} = await params

    const {data : {user}} = await supabase.auth.getUser()

    if(!user) redirect('/login')
    
    const {data : snippets, error : SnippetError} = await supabase.from('snippets').select('*').eq('project_id', id).order('created_at', {ascending : false})
    if(SnippetError) throw new Error(SnippetError?.message)
    return(
        <SnippetLibrary snippets={snippets ?? []} 
        projectId={id} 
        userId={user.id} >
        </SnippetLibrary>
    )
}
