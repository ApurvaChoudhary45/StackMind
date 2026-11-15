import ActivityRefresh from '@/components/ActivityRefresh'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ActivityList from '@/components/ActivityList'
import { getActivity } from '@/lib/activity'
import { createClient } from '@/lib/supabase/server'

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/Login')
    const params = await searchParams
    const parsed = Number(params.page ?? 1)
    const page = Number.isSafeInteger(parsed) && parsed > 0 && parsed <= 100000 ? parsed : 1
    const { events, total, setupRequired } = await getActivity(user.id, page)
    return (
        <div className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-6 sm:px-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight">Activity history</h1>
                    <p className="mt-2 text-sm text-text-text-muted">Your workspace changes and account activity, newest first.</p>
                </header>
                {setupRequired && <p role="status" className="rounded-lg border border-border p-4 text-sm text-text-text-muted">Showing existing creation history. Full activity tracking requires the activity history database migration.</p>}
                <ActivityRefresh userId={user.id} />
                <ActivityList events={events} />
                <nav aria-label="Activity pages" className="flex items-center justify-between gap-4 text-sm">
                    {page > 1 ? <Link href={'/dashboard/activity?page=' + (page - 1)} className="rounded-lg border border-border px-4 py-2 hover:bg-input">Newer activity</Link> : <span />}
                    <span className="text-text-text-muted">Page {page}</span>
                    {page * 20 < total ? <Link href={'/dashboard/activity?page=' + (page + 1)} className="rounded-lg border border-border px-4 py-2 hover:bg-input">Older activity</Link> : <span />}
                </nav>
            </div>
        </div>
    )
}
