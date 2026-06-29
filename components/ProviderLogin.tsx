'use client'
import React from 'react'

import { createClient } from '@/lib/supabase/client'

import { useState } from 'react'
const ProviderLogin = ({ provider }: { provider: 'google' | 'github' }) => {
    const supabase = createClient()

    const [loading, setloading] = useState(false)
    const [googleLoad, setGoogleLoad] = useState(false)



    async function signInWithOAuth(provider: string) {
        if (provider === 'google') {
            try {
                setloading(true)
                await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: `${window.location.origin}/auth/callback`
                    }
                })
            } catch (error) {
                console.log(error)
                setloading(false)
            }
        }
        else {

            try {
                setGoogleLoad(true)
                await supabase.auth.signInWithOAuth({
                    provider: 'github',
                    options: {
                        redirectTo: `${window.location.origin}/auth/callback`
                    }
                })
            } catch (error) {
                console.log(error)
                setGoogleLoad(false)
            }
        }


    }

    return (
        <button className="text-xs font-mono font-medium bg-green-400 text-black px-3 py-1.5 rounded-lg hover:bg-green-300 transition-colors" onClick={()=>signInWithOAuth(provider)}>
            Connect
        </button>
    )
}

export default ProviderLogin
