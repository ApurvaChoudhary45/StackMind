'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type JournalEntry = {
    id: string
    date: string
    summary: string
    notes_count: number
    bugs_fixed: number
    snippets_count: number
    most_active_project: string | null
    tags: string[]
}

type Props = {
    entries: JournalEntry[]
    userId: string
}

export default function JournalClient({ entries, userId }: Props) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    const handleGenerate = async () => {
        setLoading(true)
        setMessage('')

        try {
            const res = await fetch('/api/journal/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })
            const data = await res.json()

            if (data.skipped) {
                setMessage(data.reason === 'no activity'
                    ? 'No activity today yet — add some notes, bugs or snippets first!'
                    : 'Journal already generated for today!')
            } else {
                setMessage('Journal generated!')
                router.refresh()
            }
        } catch (error) {
            setMessage('Failed to generate journal')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 bg-background min-h-screen overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="font-mono text-sm text-zinc-600 mb-1">
                        // <span className="text-green-400">dev journal</span>
                    </p>
                    <h1 className="text-xl font-bold dark:text-zinc-200">Your Daily Journal</h1>
                </div>
                <div className="flex flex-col items-end gap-2 mt-8">
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-400 text-black text-sm font-mono font-semibold rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <><i className="ti ti-loader animate-spin" /> Generating...</>
                        ) : (
                            <><i className="ti ti-sparkles" /> Generate Today's Journal</>
                        )}
                    </button>
                    {message && (
                        <p className="text-xs font-mono text-zinc-500">{message}</p>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {entries.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <i className="ti ti-notebook text-zinc-700 text-4xl" />
                    <p className="text-zinc-600 font-mono text-sm">No journal entries yet</p>
                    <p className="text-zinc-700 font-mono text-xs">Click "Generate Today's Journal" to create your first entry</p>
                </div>
            )}

            {/* Journal Entries Timeline */}
            <div className="flex flex-col gap-4 max-w-2xl">
                {entries.map((entry, index) => (
                    <div key={entry.id} className="relative">

                        {/* Timeline line */}
                        {index < entries.length - 1 && (
                            <div className="absolute left-4 top-10 bottom-0 w-px bg-zinc-900 -mb-4" />
                        )}

                        <div className="flex gap-4">
                            {/* Timeline dot */}
                            <div className="w-8 h-8 rounded-full bg-green-950/60 border border-green-400/20 flex items-center justify-center flex-shrink-0 mt-1 z-10">
                                <div className="w-2 h-2 rounded-full bg-green-400" />
                            </div>

                            {/* Entry card */}
                            <div className="flex-1 bg-card border border-border rounded-xl p-5 mb-4">

                                {/* Date + Project */}
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-mono dark:text-zinc-500">
                                        {new Date(entry.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    {entry.most_active_project && (
                                        <span className="text-xs font-mono text-black dark:text-green-400 bg-zinc-200 dark:bg-green-950/50 border border-green-400/10 px-2 py-0.5 rounded-full">
                                            {entry.most_active_project}
                                        </span>
                                    )}
                                </div>

                                {/* Summary */}
                                <p className="text-sm dark:text-zinc-300 leading-relaxed mb-4">
                                    {entry.summary}
                                </p>

                                {/* Stats */}
                                <div className="flex gap-4 pt-3 border-t border-border">
                                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-600">
                                        <i className="ti ti-notebook text-blue-400" />
                                        {entry.notes_count} notes
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-600">
                                        <i className="ti ti-bug text-red-400" />
                                        {entry.bugs_fixed} bugs fixed
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-600">
                                        <i className="ti ti-code text-green-400" />
                                        {entry.snippets_count} snippets
                                    </div>
                                </div>

                                {/* Tags */}
                                {entry.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {[...new Set(entry.tags)].map((tag, i) => (
                                            <span key={i} className="text-xs font-mono text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}