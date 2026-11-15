'use client'

import { useState } from 'react'

declare global {
    interface Window {
        Razorpay: any
    }
}

type recurring = {
    annual: boolean

}

import { useRouter } from 'next/navigation'

export default function CheckoutButton({ annual }: recurring) {
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    async function handleCheckout() {
        try {
            setLoading(true)
            if (!window.Razorpay) throw new Error('Checkout is unavailable. Refresh and try again.')

            const response = await fetch("/api/razorpay/create-subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    billingCycle: annual ? "yearly" : "monthly",
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error)
            }

            const options = {
                key: data.keyId,

                subscription_id: data.subscriptionId,

                name: 'StackMind',

                description: 'StackMind Pro Subscription',

                image: '/logo.png',

                theme: {
                    color: '#22c55e',
                },

                modal: {
                    ondismiss: () => {
                        setLoading(false)
                    },
                },

                handler: async function (response: any) {
                    try {
                        const res = await fetch('/api/razorpay/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(response),
                        })
                        const data = await res.json()
                        if (!res.ok) {
                            alert(data.error || 'Could not verify your payment.')
                            return
                        }

                        router.replace('/welcome-pro')
                    } catch {
                        alert('Could not verify your payment. Check your subscription before retrying.')
                    } finally {
                        setLoading(false)
                    }
                }

            }
            const razorpay = new window.Razorpay(options)



            razorpay.open()
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : 'Could not open checkout.')
            setLoading(false)
        }
    }

    return (
        <div>
            <button
                onClick={handleCheckout}
                disabled={loading}
                className="mb- w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 py-3 font-semibold text-black transition hover:scale-[1.02] p-3"
            >
                {loading ? 'Preparing Checkout...' : 'Upgrade to Pro'}
            </button>
        </div>

    )
}