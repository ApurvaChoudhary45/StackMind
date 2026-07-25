'use client'
import React from 'react'

const CancelSubscription = () => {

    const handleCancelSubscription = async () => {
    const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
    })

    const data = await res.json()

    if (!res.ok) {
        alert(data.error)
        return
    }

    alert('Subscription cancelled successfully.')

    // router.refresh()
}
  return (
    <div className="border border-border rounded-2xl bg-card p-6 mt-2">
    <div className="flex items-start justify-between">
        <div>
            <h2 className="text-lg font-semibold text-green-400">
                Billing
            </h2>

            <p className="text-sm text-muted mt-1">
                Manage your StackMind Pro subscription.
            </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
            Pro Plan
        </span>
    </div>

    <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center border border-border rounded-xl p-4">
            <div>
                <p className="font-medium dark:text-white text-black">
                    Current Plan
                </p>

                <p className="text-sm text-muted">
                    StackMind Pro
                </p>
            </div>

            <div className="text-right">
                <p className="text-sm dark:text-white text-black">
                    ₹480 / month
                </p>

                <p className="text-xs text-muted">
                    Auto renews monthly
                </p>
            </div>
        </div>

        <div className="flex justify-between items-center border border-border rounded-xl p-4">
            <div>
                <p className="font-medium dark:text-white text-black">
                    Renewal Date
                </p>

                <p className="text-sm text-muted">
                    12 Aug 2026
                </p>
            </div>

            <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
            >
                Cancel Subscription
            </button>
        </div>

        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <div className="flex gap-3">
                <i className="ti ti-info-circle text-yellow-400 text-xl mt-0.5" />

                <div>
                    <p className="font-medium text-yellow-400">
                        What happens after cancellation?
                    </p>

                    <p className="text-sm text-muted mt-1">
                        Your subscription will remain active until the end of
                        your current billing cycle. You won't be charged again,
                        and your account will automatically switch to the Free
                        plan afterward.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default CancelSubscription
