import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'



const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
})

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { billingCycle } = await req.json().catch(() => null) ?? {}
        if (billingCycle !== 'monthly' && billingCycle !== 'yearly') {
            return NextResponse.json({ error: 'Invalid billing cycle.' }, { status: 400 })
        }

        const { data: current, error: lookupError } = await supabase.from('subscriptions')
            .select('plan, status')
            .eq('user_id', user.id)
            .maybeSingle()
        if (lookupError) throw lookupError
        if (!current) return NextResponse.json({ error: 'Subscription record not found.' }, { status: 404 })
        if (current.plan === 'pro') {
            return NextResponse.json({ error: 'Your account already has Pro access.' }, { status: 409 })
        }
        const planId =
            billingCycle === "yearly"
                ? process.env.RAZORPAY_PLAN_ID_ANNUAL!
                : process.env.RAZORPAY_PLAN_ID!

        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            total_count: billingCycle === "yearly" ? 1 : 12,
        })
        const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
                razorpay_subscription_id: subscription.id,
                status: 'pending',
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
        if (updateError) throw updateError

        return NextResponse.json({
            subscriptionId: subscription.id,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        })

    } catch (error: any) {
        console.error('Subscription creation failed:', error)
        return NextResponse.json(
            { error: error.error?.description || 'Failed to create subscription' },
            { status: 500 }
        )
    }
}