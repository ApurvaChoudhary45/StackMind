// app/dashboard/layout.tsx — stays SERVER component
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/DashboardShell'

import { createClient as createAdminClient } from '@supabase/supabase-js'

const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: existingSub } = await adminSupabase
        .from('subscriptions')
        .select('user_id, plan, status')
        .eq('user_id', user?.id)
        .single()
    
    

    if (!user) redirect('/Login')

    const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })



    return (
        <DashboardShell
            userName={user?.email?.split('@')[0] ?? 'Developer'}
            userEmail={user?.email ?? ''}
            projectCount={count ?? 0}
            plan={existingSub?.plan}
        >
            {children}
        </DashboardShell>
    )
}