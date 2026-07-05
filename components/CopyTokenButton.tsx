'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CopyTokenButton() {
    const [copied, setCopied] = useState(false)
    const supabase = createClient()

    const handleCopy = async () => {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.access_token) {
            alert('No active session found')
            return 
        }

        await navigator.clipboard.writeText(session.access_token)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs font-mono font-medium bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-300 transition-colors"
        >
            <i className={`ti ${copied ? 'ti-check' : 'ti-copy'} text-sm`} />
            {copied ? 'Copied!' : 'Copy API Token'}
        </button>
    )
}