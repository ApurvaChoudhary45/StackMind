'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteAccount() {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleDelete = async () => {  
        if (input !== 'DELETE') return
        setLoading(true)

        const res = await fetch('/api/delete-account', { method: 'DELETE' })
        const data = await res.json()
        
        if (data.success) {
            await supabase.auth.signOut()
            router.push('/Login')
        } else {
            console.error(data.error)
            setLoading(false)
        }
    }

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="w-full py-2.5 bg-transparent border border-red-400/20 text-red-400 text-sm font-mono rounded-lg hover:bg-red-950/30 hover:border-red-400 transition-colors"
            >
                Delete my account
            </button>

            {/* Confirmation Dialog */}
            {open && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-950 border border-red-400/20 rounded-xl w-full max-w-md p-6">
                        
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-4">
                            <i className="ti ti-alert-triangle text-red-400 text-lg" />
                            <h2 className="text-sm font-medium text-red-400 font-mono">Delete Account</h2>
                        </div>

                        {/* Warning */}
                        <p className="text-xs font-mono text-zinc-500 mb-4 leading-relaxed">
                            This will permanently delete your account and all associated data including projects, notes, bugs, snippets and GitHub tokens. <span className="text-red-400">This action cannot be undone.</span>
                        </p>

                        {/* Confirm Input */}
                        <p className="text-xs font-mono text-zinc-500 mb-2">
                            Type <span className="text-red-400 font-bold">DELETE</span> to confirm
                        </p>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="DELETE"
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-400/50 text-zinc-300 text-sm font-mono px-3 py-2 rounded-lg outline-none mb-4 transition-colors"
                        />

                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => { setOpen(false); setInput('') }}
                                className="text-xs font-mono text-zinc-500 border border-zinc-800 px-4 py-2 rounded-lg hover:text-zinc-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={input !== 'DELETE' || loading}
                                className="text-xs font-mono font-medium bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}