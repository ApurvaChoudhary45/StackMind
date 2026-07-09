// components/AskAIDrawer.tsx
'use client'

import { useState, useEffect } from "react"

type Source = {
    title: string
    score: number
}

type Props = {
    userId: string
    mode?: 'notes' | 'bugs'
}

const AskAIDrawer = ({ userId, mode = 'notes' }: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [answer, setAnswer] = useState('')
    const [sources, setSources] = useState<Source[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handleAIChat = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'q') {
                setDrawerOpen(prev => !prev)
            }   
        }
        document.addEventListener('keydown', handleAIChat)
        return () => document.removeEventListener('keydown', handleAIChat)
    }, [])



    const endpoint = mode === 'bugs' ? '/api/rag-bugs' : '/api/rag'
    const placeholder = mode === 'bugs'
        ? 'Ask anything about your bugs...'
        : 'Ask anything about your notes...'

    const handleSearch = async () => {
        if (!query.trim()) return
        setLoading(true)
        setAnswer('')
        setSources([])

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, userId })
            })
            const data = await res.json()
            setAnswer(data.answer ?? '')
            setSources(data.sources ?? [])
        } catch (error) {
            setAnswer('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Floating Ask AI Button */}
            {!drawerOpen && (
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="fixed right-4 bottom-6 flex items-center gap-2 px-4 py-2 rounded-full border border-green-400/40 text-green-400 font-mono text-sm font-medium hover:border-green-400 hover:shadow-lg hover:shadow-green-400/20 bg-black/80 backdrop-blur-sm transition-all duration-200 z-30"
                >
                    <i className="ti ti-sparkles text-lg" />
                    Ask A|
                </button>
            )}

            {/* Backdrop */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setDrawerOpen(false)}
                />
            )}

            {/* Drawer */}
            <aside className={`fixed top-0 right-0 h-full w-80 bg-background border-l border-border z-50 flex flex-col transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <i className="ti ti-sparkles text-green-400 text-base" />
                        <span className="text-sm font-medium text-black dark:text-zinc-200">
                            {mode === 'bugs' ? 'Ask about bugs' : 'Ask your notes'}
                        </span>
                    </div>
                    <button
                        onClick={() => {setAnswer(''),setSources([]), setDrawerOpen(false)}}
                        className="w-6 h-6 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-600 hover:text-red-400 hover:border-red-400/30 transition-colors"
                    >
                        <i className="ti ti-x text-sm" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSearch()}
                        placeholder={placeholder}
                        className="w-full bg-card border border-zinc-800 text-black dark:text-zinc-300 text-xs font-mono rounded-lg px-3  py-2.5 outline-none focus:border-green-400/40 resize-none h-20 placeholder:text-zinc-700"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="w-full py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-black text-xs font-mono font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <><i className="ti ti-loader animate-spin" /> Thinking...</>
                        ) : (
                            <><i className="ti ti-send" /> Ask</>
                        )}
                    </button>

                    {/* Answer */}
                    {answer && (
                        <div className="bg-background border border-border rounded-lg p-3">
                            <p className="text-xs text-black dark:text-zinc-600 font-mono uppercase tracking-widest mb-2">Answer</p>
                            <p className="text-xs text-black dark:text-zinc-400 leading-relaxed">{answer}</p>
                        </div>
                    )}

                    {/* Sources */}
                    {sources.length > 0 && (
                        <div>
                            <p className="text-xs dark:text-zinc-600 font-mono uppercase tracking-widest mb-2">Sources</p>
                            <div className="flex flex-wrap gap-1.5">
                                {sources.map((source, i) => (
                                    <span key={i} className="text-xs font-mono text-green-700 dark:text-green-400 bg-card dark:bg-green-950/50 border border-green-400/10 px-2 py-0.5 rounded-2xl">
                                        {source.title} ({Math.round(source.score * 100)}% match)
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}

export default AskAIDrawer