import CreateProject from '@/components/CreateProject'
import GithubImport from '@/components/GithubImport'
import LogOut from '@/components/LogOut'
import ProjectCard from '@/components/ProjectCard'
import Toggle from '@/components/Toggle'
import { createClient } from '@/lib/supabase/server'

import Link from 'next/link'
import { redirect } from 'next/navigation'



export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    const { count } = await supabase.from('projects').select('*', { count: 'exact', head: true })


    if (!user) redirect('/Login')

    const [{ data: projects }, { data: recentActivity }] = await Promise.all([supabase.from('projects').select('*').order('created_at', { ascending: false }), supabase.from('notes').select('title, created_at, projects(name)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)])



    return (
        <div className='bg-black/80 flex '>
            <div className='bg-black/80 h-screen flex-1 pt-2'>
                <div className='flex justify-between items-center px-5'>
                    <p className="font-mono text-sm text-zinc-600 mt-6 px-2">
                    // <span className="text-green-400">dashboard</span>
                </p>
                    <CreateProject />
                </div>
                <ProjectCard />


                {/* Recent Activity */}
                <div className='mt-8 px-8 '>
                    <h2 className='text-lg font-bold text-green-400 mb-4'>Recent Activity</h2>
                    {recentActivity?.length === 0 && (
                        <p className='text-gray-400 text-sm'>No recent activity yet.</p>
                    )}
                    <div className='flex flex-col gap-4'>
                        {recentActivity?.map((note: any) => (
                            <div key={note.title + note.created_at} className='flex justify-between items-center border border-zinc-800 rounded p-3'>
                                <div>
                                    <span className='text-white text-sm'>{note.title}</span>
                                    <span className='text-gray-500 text-xs ml-2'>in {note.projects?.name}</span>
                                </div>
                                <span className='text-gray-500 text-xs'>
                                    {new Date(note.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    )
}