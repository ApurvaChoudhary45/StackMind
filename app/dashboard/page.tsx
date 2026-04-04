import CreateProject from '@/components/CreateProject'
import LogOut from '@/components/LogOut'
import ProjectCard from '@/components/ProjectCard'
import Toggle from '@/components/Toggle'
import { createClient } from '@/lib/supabase/server'

import Link from 'next/link'
import { redirect } from 'next/navigation'



export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/Login')

    const [{ data: projects }, { data: recentActivity }] = await Promise.all([supabase.from('projects').select('*').order('created_at', { ascending: false }), supabase.from('notes').select('title, created_at, projects(name)').order('created_at', { ascending: false }).limit(5)])

    

    return (
        <div className='bg-black/80 '>
            <div className="p-5 bg-black/90 ">
                <nav className='flex justify-between items-center'>
                    <h1 className="md:text-2xl font-bold text-green-400">Welcome to StackMind</h1>
                    <div className='flex justify-center items-center md:gap-6'>
                        <p className="text-gray-400 text-sm">Logged in as: {user.email}</p>
                        <Toggle/>
                        <LogOut />
                    </div>
                </nav>
            </div>
            <div className='bg-black/80 h-screen'>
                <div className='flex justify-between items-center px-5'>
                    <h1 className='py-3 text-xl font-extrabold text-green-400 font-mono text-md rounded-2xl px-5 '>Your Projects</h1>
                    <CreateProject />
                </div>
                <ProjectCard/>


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