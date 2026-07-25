// app/api/cancel-subscription/route.ts

import { NextResponse } from "next/server";
import Razorpay from "razorpay";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
    try {
        const supabase = await createClient();
        const adminSupabase = createAdminClient();

        // Logged in user
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Current subscription
        const { data: subscription, error } = await adminSupabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (error || !subscription) {
            return NextResponse.json(
                { error: "Subscription not found." },
                { status: 404 }
            );
        }

        if (!subscription.razorpay_subscription_id) {
            return NextResponse.json(
                { error: "No Razorpay subscription found." },
                { status: 400 }
            );
        }

        // Cancel future renewals
        await razorpay.subscriptions.cancel(
            subscription.razorpay_subscription_id,
            false
        );

        // Mark for cancellation
        const { error: updateError } = await adminSupabase
            .from("subscriptions")
            .update({
                cancel_at_period_end: true,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id);

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({
            success: true,
            message:
                "Your subscription has been cancelled. Your Pro plan will remain active until the current billing period ends.",
        });
    } catch (err: any) {
        console.error(err);

        return NextResponse.json(
            {
                error: err.message || "Something went wrong.",
            },
            {
                status: 500,
            }
        );
    }
}