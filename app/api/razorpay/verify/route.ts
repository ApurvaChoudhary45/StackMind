import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'
export async function POST(req: NextRequest) {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    try {

        const supabase = await createClient()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }


        const { data: subscription, error: subscriptionError } = await supabase
            .from('subscriptions')
            .select('razorpay_subscription_id')
            .eq('user_id', user.id)
            .single()

        if (subscriptionError || !subscription?.razorpay_subscription_id) {
            return NextResponse.json(
                {
                    error: 'Subscription not found',
                },
                {
                    status: 404,
                }
            )
        }

        const body = await req.json()

        const {
            razorpay_payment_id,
            razorpay_signature,
        } = body

        const generatedSignature = crypto
            .createHmac(
                'sha256',
                process.env.RAZORPAY_KEY_SECRET!
            )
            .update(
                `${razorpay_payment_id}|${subscription.razorpay_subscription_id}`
            )
            .digest('hex')

        if (generatedSignature !== razorpay_signature) {
            return NextResponse.json(
                {
                    error: 'Invalid payment signature',
                },
                {
                    status: 400,
                }
            )
        }

        const razorpaySubscription = await razorpay.subscriptions.fetch(
            subscription.razorpay_subscription_id
        ) as any

        const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
                plan: 'pro',

                status: razorpaySubscription.status,

                razorpay_subscription_id: razorpaySubscription.id,

                razorpay_customer_id:
                    razorpaySubscription.customer_id,

                current_period_start:
                    razorpaySubscription.current_start
                        ? new Date(
                            razorpaySubscription.current_start * 1000
                        ).toISOString()
                        : null,

                current_period_end:
                    razorpaySubscription.current_end
                        ? new Date(
                            razorpaySubscription.current_end * 1000
                        ).toISOString()
                        : null,

                cancel_at_period_end: false,

                cancelled_at: null,

                updated_at: new Date().toISOString(),
            }).eq('user_id', user.id)

        if (updateError) {
            console.error(updateError)

            return NextResponse.json(
                {
                    error: 'Failed to update subscription',
                },
                {
                    status: 500,
                }
            )
        }
        return NextResponse.json({
            success: true,
            message: 'Subscription activated successfully',
        })

    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}