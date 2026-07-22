'use client'

import { useState } from 'react'

declare global {
    interface Window {
        Razorpay: any
    }
}

import { useRouter } from 'next/navigation'
import WelcomeProPage from './ProWelcome'

export default function CheckoutButton() {
    const [loading, setLoading] = useState(false)

    const [redirect, setRedirect] = useState(false)

    const router = useRouter()

    async function handleCheckout() {
        try {
            setLoading(true)

            const response = await fetch('/api/razorpay/create-subscription', {
                method: 'POST',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error)
            }

            console.log('Subscription Created:', data)

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
                        console.log('Checkout Closed')
                    },
                },

                handler: async function (response: any) {
                    const res = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(response),
                    })


                    const data = await res.json()

                    if (!res.ok) {
                        alert(data.error)
                        return
                    }

                    // await new Promise(resolve => setTimeout(resolve, 1000))
                    router.replace('/welcome-pro')
                    

                }

            }
            const razorpay = new window.Razorpay(options)



            razorpay.open()
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
        <button
            onClick={handleCheckout}
            disabled={loading}
            className="mb-10 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 py-3 font-semibold text-black transition hover:scale-[1.02]"
        >
            {loading ? 'Preparing Checkout...' : 'Upgrade to Pro'}
        </button>
        </div>
        
    )
}