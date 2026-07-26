
import { createClient } from '@/lib/supabase/server'

import { redirect } from "next/navigation";
import BillingPage from '@/components/SubscriptionManagement';
const Subscription = async () => {

    const supabase = await createClient()

    const { data, error } = await supabase.auth.getSession()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/Login')

    const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('plan, status, cancel_at_period_end, current_period_end, ai_queries_today, code_reviews_today')
        .eq('user_id', user.id)
        .single()
    

        

        return (
            <div className='bg-card overflow-y-auto'>
            <BillingPage plan={existingSub?.plan} cancelAtPeriodEnd={existingSub?.cancel_at_period_end} currentPeriodEnd={existingSub?.current_period_end} aireviews={existingSub?.ai_queries_today} codereviews={existingSub?.code_reviews_today} />
            </div>

        )
    }


export default Subscription
