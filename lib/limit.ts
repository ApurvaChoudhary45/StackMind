import { createClient } from '@supabase/supabase-js'

const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const FREE_LIMITS = {
    ai_queries: 10,
    code_reviews: 5,
    notes: 50,
    snippets: 20,
    bugs: 20,
    projects: 3,
} as const

type DailyFeature = 'ai_queries' | 'code_reviews'

export async function checkDailyLimit(
    userId: string,
    feature: DailyFeature
): Promise<{ allowed: boolean; reason?: string }> {

    const { data: sub, error } = await adminSupabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (error || !sub) {
        return {
            allowed: false,
            reason: 'Subscription not found.'
        }
    }

    // Pro users have unlimited access
    if (sub.plan === 'pro') {
        return { allowed: true }
    }

    // Reset counters once per day
    const today = new Date().toISOString().split('T')[0]

    if (sub.last_reset_date !== today) {
        await adminSupabase
            .from('subscriptions')
            .update({
                ai_queries_today: 0,
                code_reviews_today: 0,
                last_reset_date: today,
            })
            .eq('user_id', userId)

        return { allowed: true }
    }

    const currentUsage = sub[`${feature}_today`] ?? 0
    const limit = FREE_LIMITS[feature]

    if (currentUsage >= limit) {
        return {
            allowed: false,
            reason: `Daily ${feature.replace('_', ' ')} limit reached. Upgrade to Pro for unlimited usage.`,
        }
    }

    await adminSupabase
        .from('subscriptions')
        .update({
            [`${feature}_today`]: currentUsage + 1,
        })
        .eq('user_id', userId)

    return { allowed: true }
}

export async function canCreateProject(userId: string) {
    const plan = await getUserPlan(userId)

    if (plan === 'pro') {
        return { allowed: true }
    }

    const { count } = await adminSupabase
        .from('projects')
        .select('*', {
            count: 'exact',
            head: true,
        })
        .eq('user_id', userId)

    if ((count ?? 0) >= FREE_LIMITS.projects) {
        return {
            allowed: false,
            reason: 'Free plan allows up to 3 projects. Upgrade to Pro for unlimited projects.',
        }
    }

    return { allowed: true }
}

export async function canCreateNote(userId: string) {
    const plan = await getUserPlan(userId)

    if (plan === 'pro') {
        return { allowed: true }
    }

    const { count } = await adminSupabase
        .from('notes')
        .select('*', {
            count: 'exact',
            head: true,
        })
        .eq('user_id', userId)

    if ((count ?? 0) >= FREE_LIMITS.notes) {
        return {
            allowed: false,
            reason: 'Free plan allows up to 50 notes. Upgrade to Pro for unlimited notes.',
        }
    }

    return { allowed: true }
}


export async function canCreateBug(userId: string) {
    const plan = await getUserPlan(userId)

    if (plan === 'pro') {
        return { allowed: true }
    }

    const { count } = await adminSupabase
        .from('bugs')
        .select('*', {
            count: 'exact',
            head: true,
        })
        .eq('user_id', userId)

    if ((count ?? 0) >= FREE_LIMITS.bugs) {
        return {
            allowed: false,
            reason: 'Free plan allows up to 20 bugs. Upgrade to Pro for unlimited bugs.',
        }
    }

    return { allowed: true }
}

export async function canCreateSnippet(userId: string) {
    const plan = await getUserPlan(userId)

    if (plan === 'pro') {
        return { allowed: true }
    }

    const { count } = await adminSupabase
        .from('snippets')
        .select('*', {
            count: 'exact',
            head: true,
        })
        .eq('user_id', userId)

    if ((count ?? 0) >= FREE_LIMITS.snippets) {
        return {
            allowed: false,
            reason: 'Free plan allows up to 20 snippets. Upgrade to Pro for unlimited snippets.',
        }
    }

    return { allowed: true }
}

export async function getUserPlan(
    userId: string
): Promise<'free' | 'pro'> {

    const { data } = await adminSupabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', userId)
        .single()

    return (data?.plan as 'free' | 'pro') ?? 'free'
}