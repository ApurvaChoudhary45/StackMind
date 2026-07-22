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
        <div className='bg-background flex overflow-y-auto'>
            <div className='bg-background h-screen flex-1 pt-2'>
                <div className='flex justify-between items-center px-5'>
                    <p className="font-mono text-sm text-text-muted mt-2 px-2">
                    // <span className="text-muted">dashboard</span>
                </p>
                    <CreateProject />
                </div>
                <ProjectCard />


                {/* Recent Activity */}
                <div className="mt-10 px-8">
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Recent Activity
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Your latest notes across all projects.
      </p>
    </div>

    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
      <i className="ti ti-activity text-xl text-green-400" />
    </div>
  </div>

  {recentActivity?.length === 0 ? (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-green-500/20 bg-card py-14">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
        <i className="ti ti-history text-3xl text-green-400" />
      </div>

      <div className="text-center">
        <h3 className="font-semibold text-zinc-900 dark:text-white">
          No Activity Yet
        </h3>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Your recently created notes will appear here.
        </p>
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      {recentActivity?.map((note: any) => (
        <div
          key={note.title + note.created_at}
          className="group flex items-center justify-between rounded-2xl border border-green-500/10 bg-card p-5 transition-all duration-300 hover:border-green-400/30 hover:shadow-[0_0_25px_rgba(34,197,94,0.08)]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <i className="ti ti-notebook text-xl text-green-400" />
            </div>

            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">
                {note.title}
              </h3>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="font-medium text-green-500 dark:text-green-400">
                  {note.projects?.name}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <i className="ti ti-calendar-event" />
            {new Date(note.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

            </div>

        </div>
    )
}