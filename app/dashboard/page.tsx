import Link from 'next/link'
import { redirect } from 'next/navigation'
import ActivityList from '@/components/ActivityList'
import ActivityRefresh from '@/components/ActivityRefresh'
import CreateProject from '@/components/CreateProject'
import ProjectCard from '@/components/ProjectCard'
import { getActivity } from '@/lib/activity'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/Login')

    const [projectsResult, recentActivity] = await Promise.all([
        supabase.from('projects')
            .select('id, name, description')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        getActivity(user.id, 1, 5),
    ])
    if (projectsResult.error) throw projectsResult.error

    return (
        <div className="min-h-0 flex-1 overflow-y-auto bg-background">
            <div className="mx-auto max-w-7xl pb-8 pt-4 sm:pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-8">
                    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                    <CreateProject />
                </div>
                <ProjectCard initialProjects={projectsResult.data ?? []} />

                <section aria-labelledby="recent-activity-heading" className="mt-8 px-4 md:px-8">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <h2 id="recent-activity-heading" className="text-lg font-semibold">Recent Activity</h2>
                            <p className="mt-0.5 text-xs text-text-text-muted">Your latest actions across StackMind.</p>
                        </div>
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                            <i className="ti ti-activity text-base text-text-muted" aria-hidden="true" />
                        </div>
                    </div>
                    <ActivityRefresh userId={user.id} />
                    <ActivityList events={recentActivity.events} compact />
                    <div className="mt-2 flex justify-end">
                        <Link href="/dashboard/activity" className="rounded-lg px-3 py-2 text-sm font-medium text-text-muted hover:bg-green-500/10">
                            View all activity <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    )
}
