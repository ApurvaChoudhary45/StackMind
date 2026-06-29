'use client'

import { useState, useEffect } from "react"
import Link from "next/link"

type Result = {
    id: string
    title: string
    type: 'bug' | 'snippet' | 'note'
    project_id: string
}

const typeConfig = {
    note: {
        icon: 'ti-notebook',
        color: 'text-blue-400',
        bg: 'bg-blue-950/50',
        border: 'border-blue-400/20',
        label: 'Note'
    },
    bug: {
        icon: 'ti-bug',
        color: 'text-red-400',
        bg: 'bg-red-950/50',
        border: 'border-red-400/20',
        label: 'Bug'
    },
    snippet: {
        icon: 'ti-code',
        color: 'text-green-400',
        bg: 'bg-green-950/50',
        border: 'border-green-400/20',
        label: 'Snippet'
    }
}

const typeHref = (item: Result) => {
    const base = `/dashboard/projects/${item.project_id}`
    if (item.type === 'bug') return `${base}/bugs`
    if (item.type === 'snippet') return `${base}/snippets`
    return `${base}/notes`
}

const GlobalSearch = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Result[]>([])
    const [loading, setLoading] = useState(false)

    // Ctrl+K toggle
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
            if (e.key === 'Escape') setIsOpen(false)
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Debounced search
    useEffect(() => {
        if (!query.trim()) { setResults([]); return }
        setLoading(true)
        const timer = setTimeout(async () => {
            const data = await fetch(`/api/search?q=${query}`)
            const res = await data.json()
            setResults(res?.result ?? [])
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [query])

    // Reset on close
    const handleClose = () => {
        setIsOpen(false)
        setQuery('')
        setResults([])
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 pt-24 px-4"
            onClick={handleClose}
        >   
            <div
                className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-900">
                    <i className={`ti ${loading ? 'ti-loader animate-spin' : 'ti-search'} text-zinc-500 text-base`} />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search notes, bugs, snippets..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-zinc-200 placeholder:text-zinc-600"
                    />
                    <kbd className="text-xs font-mono text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                    {query.length === 0 && (
                        <div className="px-4 py-8 text-center">
                            <i className="ti ti-search text-zinc-700 text-2xl mb-2 block" />
                            <p className="text-xs font-mono text-zinc-600">
                                Start typing to search across everything
                            </p>
                        </div>
                    )}

                    {query.length > 0 && !loading && results.length === 0 && (
                        <div className="px-4 py-8 text-center">
                            <i className="ti ti-mood-empty text-zinc-700 text-2xl mb-2 block" />
                            <p className="text-xs font-mono text-zinc-600">
                                No results for <span className="text-zinc-400">"{query}"</span>
                            </p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="p-2">
                            {/* Group by type */}
                            {(['note', 'bug', 'snippet'] as const).map(type => {
                                const group = results.filter(r => r.type === type)
                                if (group.length === 0) return null
                                const config = typeConfig[type]

                                return (
                                    <div key={type} className="mb-3">
                                        {/* Group label */}
                                        <p className="text-xs font-mono text-zinc-600 px-2 py-1 uppercase tracking-widest">
                                            {config.label}s
                                        </p>
                                        {group.map(item => (
                                            <Link
                                                key={item.id}
                                                href={typeHref(item)}
                                                onClick={handleClose}
                                            >
                                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-900 transition-colors group cursor-pointer">
                                                    {/* Icon */}
                                                    <div className={`w-7 h-7 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                                                        <i className={`ti ${config.icon} ${config.color} text-sm`} />
                                                    </div>

                                                    {/* Title */}
                                                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors flex-1 truncate font-mono">
                                                        {item.title}
                                                    </span>

                                                    {/* Badge */}
                                                    <span className={`text-xs font-mono ${config.color} ${config.bg} border ${config.border} px-2 py-0.5 rounded-full flex-shrink-0`}>
                                                        {config.label}
                                                    </span>

                                                    {/* Arrow */}
                                                    <i className="ti ti-arrow-right text-zinc-700 group-hover:text-zinc-400 transition-colors text-sm" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-zinc-900 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-600">
                        <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-xs">↵</kbd>
                        to open
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-600">
                        <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-xs">ESC</kbd>
                        to close
                    </div>
                    <div className="ml-auto text-xs font-mono text-zinc-700">
                        {results.length > 0 && `${results.length} results`}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GlobalSearch