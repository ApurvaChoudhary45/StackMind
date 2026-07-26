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
       <button
    className="text-xs font-mono font-medium bg-green-400 text-black px-3 py-1.5 rounded-lg hover:bg-green-300 transition-colors flex items-center justify-center gap-2"
    onClick={() => signInWithOAuth(provider)}
>
    {(provider === 'google' ? loading : googleLoad) ? (
        <span className='flex items-center gap-3'>
            <i className="ti ti-loader animate-spin text-base" />
            Connecting...
        </span>
    ) : (
        'Connect'
    )}
</button>
    )
}

export default ProviderLogin
