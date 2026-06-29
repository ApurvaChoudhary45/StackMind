'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const Disconnect = ({ provider }: { provider: 'google' | 'github' }) => {
    const router = useRouter()

    const disconnectProvider = async () => {
        const res = await fetch('/api/disconnect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },    
            body: JSON.stringify({ provider })
        })

        const data = await res.json()

        if (data.success) {
            console.log(`${provider} disconnected!`)
            router.refresh() // ← refresh page to reflect new state
        } else {
            console.error('Failed:', data.error)
        }
    }

    return (
        <button
            onClick={disconnectProvider}
            className="text-xs font-mono text-zinc-500 border border-zinc-800 px-3 py-1.5 rounded-lg hover:text-red-400 hover:border-red-400/30 hover:bg-red-950/20 transition-colors"
        >
            Disconnect
        </button>
    )
}

export default Disconnect