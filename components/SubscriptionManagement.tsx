'use client'

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
type BillingProps = {
    plan: 'free' | 'pro'
    // status: 'active' | 'cancelled'
    cancelAtPeriodEnd: boolean
    currentPeriodEnd: string | null
    aireviews: number
    codereviews: number
    // onCancel: () => void
    // onResume?: () => void
}

export default function BillingPage({
    plan,
    cancelAtPeriodEnd,
    currentPeriodEnd,
    aireviews,
    codereviews,

}: BillingProps) {

    const [showCancelModal, setshowCancelModal] = useState(false)
    const [loading, setloading] = useState(false)

    const router = useRouter()
    
    const endDate = currentPeriodEnd
        ? new Date(currentPeriodEnd).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : null
    
    console.log(endDate)

    const handleCancelSubscription = async () => {
        setloading(true)
        try {
            const res = await fetch('/api/cancel-subscription', {
            method: 'POST',
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.error)
            return
        }

        setshowCancelModal(false)

        router.refresh()

        } finally{
            setloading(false)
        }

    }

    return (
        <div className="w-full mx-auto p-8 space-y-8 overflow-y-auto">

            {/* Header */}

            <div>
                <h1 className="text-3xl font-bold text-green-400">
                    Billing & Subscription
                </h1>

                <p className="text-muted mt-2">
                    Manage your StackMind subscription and billing details.
                </p>
            </div>

            {/* Subscription */}

            <div className="rounded-3xl border border-green-500/20 bg-card overflow-hidden">

                <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-transparent" />

                <div className="p-8">

                    <div className="flex flex-col md:flex-row md:justify-between gap-8">

                        <div>

                            <div className="flex items-center gap-3">

                                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">

                                    <i className="ti ti-crown text-green-400 text-2xl" />

                                </div>

                                <div>

                                    <h2 className="text-2xl font-bold">

                                        {plan === 'pro'
                                            ? 'StackMind Pro'
                                            : 'StackMind Free'}

                                    </h2>

                                    <p className="text-muted text-sm">
                                        Developer productivity subscription
                                    </p>

                                </div>

                            </div>

                            <div className="mt-8 grid gap-5">

                                <div>

                                    <p className="text-xs uppercase tracking-widest text-muted mb-1">
                                        Status
                                    </p>

                                    {plan === 'free' && (
                                        <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-sm">
                                            Free
                                        </span>
                                    )}

                                    {plan === 'pro' && !cancelAtPeriodEnd && (
                                        <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-sm">
                                            Active
                                        </span>
                                    )}

                                    {plan === 'pro' && cancelAtPeriodEnd && (
                                        <span className="px-3 py-1 rounded-full bg-yellow-500/15 text-yellow-300 text-sm">
                                            Cancelling
                                        </span>
                                    )}

                                </div>

                                {plan === 'pro' && (

                                    <div>

                                        <p className="text-xs uppercase tracking-widest text-muted mb-1">

                                            {cancelAtPeriodEnd
                                                ? 'Ends On'
                                                : 'Renews On'}

                                        </p>

                                        <p className="font-semibold text-lg">
                                            {endDate}
                                        </p>

                                    </div>

                                )}

                            </div>

                        </div>

                        <div className="flex items-end">

                            {plan === 'free' && (

                                <Link href={`/dashboard/pricing`}><button className="px-6 py-3 rounded-xl bg-green-400 hover:bg-green-300 text-black font-semibold">
                                    Upgrade to Pro
                                </button></Link>

                            )}

                            {plan === 'pro' && !cancelAtPeriodEnd && (

                                <button
                                    onClick={() => setshowCancelModal(true)}
                                    className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold"
                                >
                                    Cancel Subscription
                                </button>

                            )}

                            {/* {plan === 'pro' && cancelAtPeriodEnd && (

                                <button
                                    onClick={onResume}
                                    className="px-6 py-3 rounded-xl bg-green-400 hover:bg-green-300 text-black font-semibold"
                                >
                                    Resume Subscription
                                </button>

                            )} */}

                        </div>

                    </div>

                </div>

            </div>

            {/* Cards */}

            <div className="grid md:grid-cols-2 gap-6">
                {/* 
                <div className="rounded-2xl border border-border bg-card p-6">

                    <div className="flex items-center gap-3 mb-4">

                        <i className="ti ti-credit-card text-green-400 text-xl" />

                        <h3 className="font-semibold">
                            Payment Method
                        </h3>

                    </div>

                    <p className="text-muted text-sm">
                        Payments are securely managed by Razorpay.
                    </p>

                    <div className="mt-5 rounded-xl border border-border p-4">

                        <div className="flex justify-between">

                            <span className="text-muted">
                                Card
                            </span>

                            <span className="font-medium">
                                Managed by Razorpay
                            </span>

                        </div>

                    </div>

                </div> */}

                <div className="rounded-2xl border border-border bg-card p-6">

                    <div className="flex items-center gap-3 mb-4">

                        <i className="ti ti-chart-bar text-green-400 text-xl" />

                        <h3 className="font-semibold">
                            Current Usage
                        </h3>

                    </div>

                    <div className="space-y-4">

                        <div>

                            <div className="flex justify-between text-sm">

                                <span>AI Queries</span>

                                <span>
                                    {plan === 'pro'
                                        ? 'Unlimited'
                                        : `${aireviews}/10`}
                                </span>

                            </div>

                        </div>

                        <div>

                            <div className="flex justify-between text-sm">

                                <span>Code Reviews</span>

                                <span>
                                    {plan === 'pro'
                                        ? 'Unlimited'
                                        : `${codereviews}/5`}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Billing */}

            {/* <div className="rounded-2xl border border-border bg-card p-6">

                <div className="flex items-center gap-3 mb-6">

                    <i className="ti ti-receipt text-green-400 text-xl" />

                    <h3 className="font-semibold">
                        Billing History
                    </h3>

                </div>

                <div className="border border-dashed border-border rounded-xl p-10 text-center">

                    <i className="ti ti-file-invoice text-4xl text-muted" />

                    <p className="mt-4 text-muted">
                        Invoices will appear here after your first payment.
                    </p>

                </div>

            </div> */}

            {/* Security */}

            <div className="rounded-2xl border border-green-500/15 bg-card p-6">

                <div className="flex items-center gap-3">

                    <i className="ti ti-shield-lock text-green-400 text-xl" />

                    <div>

                        <h3 className="font-semibold">
                            Secure Payments
                        </h3>

                        <p className="text-sm text-muted mt-1">
                            StackMind never stores your card information.
                            Payments are securely processed by Razorpay.
                        </p>

                    </div>

                </div>

            </div>

            {/* Danger */}

            {plan === 'pro' && !cancelAtPeriodEnd && (

                <div className="rounded-2xl border border-red-500/20 bg-card p-6">

                    <div className="flex items-center gap-3 mb-4">

                        <i className="ti ti-alert-triangle text-red-400 text-xl" />

                        <h3 className="font-semibold text-red-400">
                            Danger Zone
                        </h3>

                    </div>

                    <p className="text-muted text-sm leading-7">

                        Cancelling your subscription will stop future
                        renewals.

                        <br />

                        You will continue enjoying StackMind Pro until
                        your billing period ends.

                    </p>

                </div>

            )}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">

                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                                <i className="ti ti-alert-triangle text-red-400 text-2xl" />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold">
                                    Cancel Subscription?
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Your subscription will remain active until the end of the current billing period.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 mb-6">
                            <p className="text-sm leading-6 text-yellow-200">

                                • You will keep all Pro features until your renewal date.

                                <br /><br />

                                • No future payments will be charged.

                                <br /><br />

                                • After the billing period ends, your account will automatically move to the Free plan.

                            </p>
                        </div>

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setshowCancelModal(false)}
                                className="rounded-lg border border-border px-4 py-2 hover:bg-muted transition"
                            >
                                Keep Subscription
                            </button>

                            <button
                                onClick={handleCancelSubscription}
                                disabled={loading}
                                className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <i className="ti ti-loader animate-spin mr-2" />
                                        Cancelling...
                                    </>
                                ) : (
                                    "Cancel Subscription"
                                )}
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}