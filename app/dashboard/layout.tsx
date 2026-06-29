// app/dashboard/layout.tsx — stays SERVER component
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/DashboardShell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/Login')

    const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })

    return (
        <DashboardShell
            userName={user?.email?.split('@')[0] ?? 'Developer'}
            userEmail={user?.email ?? ''}
            projectCount={count ?? 0}
        >
            {children}
        </DashboardShell>
    )
}