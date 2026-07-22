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

        // Create a Razorpay subscription
        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID!,
            customer_notify: 1,
            total_count: 12, // 12 months — required field but subscription auto-renews
            notes: {
                userId: user.id,
                email: user.email ?? ''
            }
        })

        await supabase
            .from('subscriptions')
            .update({
                razorpay_subscription_id: subscription.id,
                status: 'pending',
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)

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