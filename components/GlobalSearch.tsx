'use client'

import { useState, useEffect } from "react"
import Link from "next/link"

type Result = {
    id: string
    title: string
    type: 'bug' | 'snippet' | 'note'
    project_id: string | null
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
    const section = item.type === 'bug' ? 'bugs' : item.type === 'snippet' ? 'snippets' : 'notes'
    return item.project_id
        ? '/dashboard/projects/' + item.project_id + '/' + section
        : '/dashboard/' + section
}

const GlobalSearch = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Result[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleClose = () => {
        setIsOpen(false)
        setQuery('')
        setResults([])
        setLoading(false)
        setError('')
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault()
                if (isOpen) handleClose()
                else setIsOpen(true)
            }
            if (event.key === 'Escape' && isOpen) handleClose()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen])

    useEffect(() => {
        if (!isOpen || !query.trim()) return

        const controller = new AbortController()
        const timer = setTimeout(async () => {
            try {
                const response = await fetch('/api/search?' + new URLSearchParams({ q: query }), {
                    signal: controller.signal,
                })
                if (!response.ok) {
                    throw new Error(response.status === 401 ? 'Sign in to search your workspace.' : 'Search failed. Try again.')
                }
                const data = await response.json()
                if (!controller.signal.aborted) setResults(data.result ?? [])
            } catch (error) {
                if (!controller.signal.aborted) setError(error instanceof Error ? error.message : 'Search failed.')
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }, 350)

        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [isOpen, query])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-[60] pt-8 sm:pt-24 px-4 overflow-hidden"
            onClick={handleClose}
        >   
            <div
                role="dialog"
                aria-label="Search workspace"
                className="max-h-[85dvh] bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden overflow-y-auto overscroll-contain"
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
                        aria-label="Search notes, bugs, and snippets"
                        onChange={event => {
                            const nextQuery = event.target.value
                            setQuery(nextQuery)
                            setResults([])
                            setError('')
                            setLoading(Boolean(nextQuery.trim()))
                        }}
                        className="min-w-0 flex-1 bg-transparent border-none outline-none text-sm font-mono text-zinc-200 placeholder:text-zinc-600"
                    />
                    <kbd className="text-xs font-mono text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                    {!query.trim() && (
                        <div className="px-4 py-8 text-center">
                            <i className="ti ti-search text-zinc-700 text-2xl mb-2 block" />
                            <p className="text-xs font-mono text-zinc-600">
                                Start typing to search across everything
                            </p>
                        </div>
                    )}

                    {error && <p role="alert" className="px-4 py-6 text-sm text-red-300">{error}</p>}
                    {query.trim() && !error && !loading && results.length === 0 && (
                        <div className="px-4 py-8 text-center">
                            <i className="ti ti-mood-empty text-zinc-700 text-2xl mb-2 block" />
                            <p className="text-xs font-mono text-zinc-600">
                                No results for <span className="text-zinc-400">&ldquo;{query}&rdquo;</span>
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