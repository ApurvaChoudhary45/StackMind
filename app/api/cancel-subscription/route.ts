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

        // 1. Logged-in user
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Get current subscription from DB
        const { data: subscription, error } = await adminSupabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (error || !subscription) {
            console.error("Subscription lookup failed:", error);

            return NextResponse.json(
                { error: "Subscription not found." },
                { status: 404 }
            );
        }

        const razorpaySubscriptionId =
            subscription.razorpay_subscription_id;

        if (!razorpaySubscriptionId) {
            return NextResponse.json(
                { error: "No Razorpay subscription found." },
                { status: 400 }
            );
        }

        console.log(
            "Cancelling Razorpay subscription:",
            razorpaySubscriptionId
        );

        // 3. Fetch subscription from Razorpay first
        const razorpaySubscription =
            await razorpay.subscriptions.fetch(
                razorpaySubscriptionId
            );

        console.log("Razorpay subscription state:", {
            id: razorpaySubscription.id,
            status: razorpaySubscription.status,
            current_start: razorpaySubscription.current_start,
            current_end: razorpaySubscription.current_end,
            charge_at: razorpaySubscription.charge_at,
            paid_count: razorpaySubscription.paid_count,
            remaining_count: razorpaySubscription.remaining_count,
        });

        // 4. Don't attempt to cancel an already-cancelled subscription
        if (razorpaySubscription.status === "cancelled") {
            return NextResponse.json({
                success: true,
                message: "Subscription is already cancelled.",
            });
        }

        // 5. Cancel at the end of the current billing cycle
        await razorpay.subscriptions.cancel(
            razorpaySubscriptionId,
            true
        );

        console.log(
            "Razorpay cancellation successful:",
            razorpaySubscriptionId
        );

        // 6. Mark cancellation in our DB
        const { error: updateError } = await adminSupabase
            .from("subscriptions")
            .update({
                cancel_at_period_end: true,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id);

        if (updateError) {
            console.error(
                "Supabase subscription update failed:",
                updateError
            );

            throw updateError;
        }

        return NextResponse.json({
            success: true,
            message:
                "Your subscription has been cancelled. Your Pro plan will remain active until the current billing period ends.",
        });
    } catch (err: any) {
        console.error("========== CANCEL SUBSCRIPTION ERROR ==========");
        console.error("message:", err?.message);
        console.error("statusCode:", err?.statusCode);
        console.error("error:", err?.error);
        console.error("description:", err?.error?.description);
        console.error("code:", err?.error?.code);
        console.error("==============================================");

        return NextResponse.json(
            {
                error:
                    err?.error?.description ||
                    err?.message ||
                    "Something went wrong.",
                code: err?.error?.code || null,
            },
            {
                status: err?.statusCode || 500,
            }
        );
    }
}