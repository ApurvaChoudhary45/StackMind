import React from 'react'
import { createClient } from '@/lib/supabase/server'
import ConnectGit from "@/components/ConnectGit";
const Github = async () => {

    const supabase = await createClient()

    const { data, error } = await supabase.auth.getSession()

    const { data: { user } } = await supabase.auth.getUser()

    const project = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    const { data: snippets } = await supabase.from('snippets').select('project_id').order('created_at', { ascending: false })


    const projectId = snippets?.[0]?.project_id;

    const userId = user?.id

    if (!userId) throw new Error("No user logged in");


    if (error) {
        console.error("Error fetching session:", error.message)
        return
    }

    if (!data.session) {
        console.error("No active session")
        return
    }

    const token = data.session.provider_token

    if (!token) {
        console.error("No GitHub token found")
        return
    }

    return (
        <div>
            <ConnectGit projectId={projectId} userId={userId} />

        </div>
    )
}

export default Github
