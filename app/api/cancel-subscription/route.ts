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

        // Already marked as cancelling — avoid calling Razorpay again
        if (subscription.cancel_at_period_end) {
            return NextResponse.json({
                success: true,
                message:
                    "Your subscription is already set to cancel at the end of the billing period.",
            });
        }

        // Cancel at end of current billing cycle (not immediately)
        try {
            await razorpay.subscriptions.cancel(
                subscription.razorpay_subscription_id,
                true // cancel_at_cycle_end = true
            );
        } catch (rpErr: any) {
            const description = rpErr?.error?.description;
            const reason = rpErr?.error?.reason;

            console.error(
                "Razorpay cancel error:",
                JSON.stringify(rpErr, null, 2)
            );

            // If Razorpay says it's already cancelled, treat as success
            // and sync our DB instead of surfacing an error to the user.
            if (
                reason === "subscription_already_cancelled" ||
                description?.toLowerCase().includes("already")
            ) {
                const { error: syncError } = await adminSupabase
                    .from("subscriptions")
                    .update({
                        cancel_at_period_end: true,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("user_id", user.id);

                if (syncError) throw syncError;

                return NextResponse.json({
                    success: true,
                    message:
                        "Your subscription was already cancelled. Your Pro plan will remain active until the current billing period ends.",
                });
            }

            // Otherwise, surface Razorpay's real reason instead of a generic message
            return NextResponse.json(
                {
                    error:
                        description ||
                        rpErr?.message ||
                        "Failed to cancel subscription with payment provider.",
                },
                { status: rpErr?.statusCode ? Number(rpErr.statusCode) : 500 }
            );
        }

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
        console.error(
            "Cancel subscription error:",
            JSON.stringify(err, null, 2)
        );

        const message =
            err?.error?.description || err?.message || "Something went wrong.";

        return NextResponse.json({ error: message }, { status: 500 });
    }
}