import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const admin = createAdminClient()

async function handleSubscriptionCancelled(subscription: any) {

    await admin
        .from('subscriptions')
        .update({
            cancel_at_period_end: true,
            current_period_end: new Date(subscription.current_end * 1000),
        })
        .eq(
            'razorpay_subscription_id',
            subscription.id
        )
}

async function handleSubscriptionCompleted(subscription: any) {

    await admin
        .from('subscriptions')
        .update({
            plan: 'free',
            status: 'cancelled',

            cancel_at_period_end: false,

            razorpay_subscription_id: null,

            razorpay_customer_id: null,

            current_period_end: null,
        })
        .eq(
            'razorpay_subscription_id',
            subscription.id
        )
}

async function handlePaymentFailed(payment: any) {

    console.log('Payment failed:', payment.id)

    // optional:
    // send email
    // notify user
}


export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text()

        const signature = req.headers.get('x-razorpay-signature')

        const expectedSignature = crypto
            .createHmac(
                'sha256',
                process.env.RAZORPAY_WEBHOOK_SECRET!
            )
            .update(rawBody)
            .digest('hex')

        if (signature !== expectedSignature) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            )
        }

        const event = JSON.parse(rawBody)

        switch (event.event) {

            case 'subscription.cancelled':
                await handleSubscriptionCancelled(event.payload.subscription.entity)
                break

            case 'subscription.completed':
                await handleSubscriptionCompleted(event.payload.subscription.entity)
                break

            case 'payment.failed':
                await handlePaymentFailed(event.payload.payment.entity)
                break

            default:
                console.log('Ignored event:', event.event)
        }

        return NextResponse.json({ success: true })

    } catch (err) {
        console.error(err)

        return NextResponse.json(
            {
                error: 'Webhook failed',
            },
            {
                status: 500,
            }
        )
    }
}