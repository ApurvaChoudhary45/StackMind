// components/CodeReview.tsx
'use client'

import { useState, useEffect } from 'react'

type ReviewItem = {
    type: 'error' | 'warning' | 'suggestion'
    title: string
    description: string
}

type ReviewResult = {
    items: ReviewItem[]
    score: number
    sources: { title: string; score: number }[]
}

const reviewOptions = [
    { id: 'bugs', label: 'Bugs', icon: 'ti-bug' },
    { id: 'performance', label: 'Performance', icon: 'ti-bolt' },
    { id: 'security', label: 'Security', icon: 'ti-shield' },
    { id: 'documentation', label: 'Documentation', icon: 'ti-file-description' },
    { id: 'bestPractices', label: 'Best Practices', icon: 'ti-sparkles' },
]

const typeConfig = {
    error: {
        bg: 'bg-red-950/30',
        border: 'border-red-400/20',
        icon: 'ti-circle-x',
        iconColor: 'text-red-400',
        titleColor: 'text-red-400',
        badge: 'text-red-400 bg-red-950/50 border-red-400/20'
    },
    warning: {
        bg: 'bg-amber-950/20',
        border: 'border-amber-400/20',
        icon: 'ti-alert-triangle',
        iconColor: 'text-amber-400',
        titleColor: 'text-amber-400',
        badge: 'text-amber-400 bg-amber-950/50 border-amber-400/20'
    },
    suggestion: {
        bg: 'bg-green-950/20',
        border: 'border-green-400/20',
        icon: 'ti-bulb',
        iconColor: 'text-green-400',
        titleColor: 'text-green-400',
        badge: 'text-green-400 bg-green-950/50 border-green-400/20'
    }
}

type analyzeSnippet = {
    userId: string,
    analyze: boolean,
    setAnalyze: React.Dispatch<React.SetStateAction<boolean>>
}

type Source = {
    title: string
    score: number
}

export default function AnalyzeSnippet({ userId, analyze, setAnalyze }: analyzeSnippet) {
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ReviewResult | null>(null)
    const [activeOptions, setActiveOptions] = useState(['bugs', 'performance', 'security', 'bestPractices'])
    const [answer, setAnswer] = useState('')
    const [sources, setSources] = useState<Source[]>([])

    const toggleOption = (id: string) => {
        setActiveOptions(prev =>
            prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
        )
    }

    const handleReview = async () => {
        if (!code.trim()) return
        setLoading(true)
        setResult(null)

        try {
            const res = await fetch('/api/rag-snippets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, userId, options: activeOptions })
            })
            const data = await res.json()
            setResult(data)
        } catch (error) {
            console.error('Review failed:', error)
        } finally {
            setLoading(false)
        }
    }

    const openAnalyzeModal = () => {
        setAnalyze(true)
    }

    const cleanInput = () => {
        setCode('')
        setResult(null)
        setAnalyze(false)
    }

    useEffect(() => {
  if (analyze) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
}, [analyze])
    useEffect(() => {
        const aiAnalyzerHandler = (e: KeyboardEvent) => {
            
            if ((e.metaKey || e.altKey) && e.key.toLocaleLowerCase() === 'j') {
                e.preventDefault()
                setAnalyze(prev => !prev)
            }
        }
        document.addEventListener('keydown', aiAnalyzerHandler)
        return () => document.removeEventListener('keydown', aiAnalyzerHandler)
    }, [analyze])

    return (
        <>
            <button
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/40 
bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 
bg-clip-text text-transparent 
font-mono text-sm font-medium 
hover:border-purple-400 hover:shadow-lg hover:shadow-purple-400/20 
backdrop-blur-sm transition-all duration-200 z-30 
animate-gradient-x
"
                onClick={openAnalyzeModal}
            >
                <i className="ti ti-sparkles text-lg" />
                Analyze Snippet
            </button>
            {analyze && <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4" onClick={() => setAnalyze(false)}>
                <div className="bg-background border border-zinc-800 rounded-2xl w-full max-w-4xl " >

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-card border border-green-400/20 flex items-center justify-center">
                                <i className="ti ti-code-dots text-green-400 text-lg" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold dark:text-zinc-200">Smart Code Review</p>
                                <p className="text-xs font-mono text-zinc-600">// powered by your notes + Claude</p>
                            </div>
                        </div>
                        <button
                            onClick={cleanInput}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-600 hover:text-red-400 hover:border-red-400/30 transition-colors"
                        >
                            <i className="ti ti-x text-sm" />
                        </button>
                    </div>

                    {/* Code Input */}
                    <div className="px-6 py-4 border-b border-zinc-900" onClick={(e)=>e.stopPropagation()}>
                        <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-2">Paste your code</p>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="// paste your code here..."
                            className="w-full dark:bg-black/60 border border-border text-green-700 dark:text-green-400 font-mono text-xs rounded-xl px-4 py-3 outline-none focus:border-green-400/30 resize-none h-32 placeholder:text-zinc-700"
                        />
                    </div>

                    {/* Review Options */}
                    <div className="px-6 py-3 border-b border-zinc-900 flex gap-2 flex-wrap">
                        {reviewOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => toggleOption(option.id)}
                                className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border transition-colors ${activeOptions.includes(option.id)
                                    ? 'bg-zinc-400 dark:bg-green-950/60 dark:text-green-400 border-green-400/20'
                                    : 'dark:text-zinc-600 border-zinc-800 hover:text-zinc-700'
                                    }`}
                            >
                                <i className={`ti ${option.icon} text-xs`} />
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {/* Review Button */}
                    <div className="px-6 py-3 border-b border-border">
                        <button
                            onClick={handleReview}
                            disabled={loading || !code.trim()}
                            className="w-full py-2.5 bg-gradient-to-r from-green-400 to-emerald-500 text-black text-sm font-mono font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                        >
                            {loading ? (
                                <><i className="ti ti-loader animate-spin" /> Reviewing...</>
                            ) : (
                                <><i className="ti ti-player-play" /> Run Code Review</>
                            )}
                        </button>
                    </div>

                    {/* Results */}
                    {result && (
                        <>
                            <div className="px-6 py-4 max-h-56 overflow-y-auto flex flex-col gap-2">
                                {result.items.map((item, i) => {
                                    const config = typeConfig[item.type]
                                    return (
                                        <div key={i} className={`flex gap-3 p-3 rounded-xl border ${config.bg} ${config.border}`}>
                                            <i className={`ti ${config.icon} ${config.iconColor} text-base flex-shrink-0 mt-0.5`} />
                                            <div className="flex-1">
                                                <p className={`text-xs font-medium ${config.titleColor} mb-1`}>{item.title}</p>
                                                <p className="text-xs font-mono dark:text-zinc-500 leading-relaxed">{item.description}</p>
                                            </div>
                                            <span className={`text-xs font-mono border px-2 py-0.5 rounded-full self-start flex-shrink-0 ${config.badge}`}>
                                                {item.type}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Score */}
                            <div className="px-6 py-3 border-t border-zinc-900 flex items-center gap-3">
                                <span className="text-xs font-mono text-zinc-600">Code quality</span>
                                <div className="flex-1 h-1 bg-zinc-600 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 dark:bg-gradient-to-r dark:from-green-400 dark:to-emerald-500 rounded-full transition-all duration-500"
                                        style={{ width: `${result.score}%` }}
                                    />
                                </div>
                                <span className="text-sm font-mono font-semibold text-green-400">{result.score}/100</span>
                            </div>

                            {/* Sources */}
                            {result.sources.length > 0 && (
                                <div>
                                    <p className="dark:text-gray-500 text-xs mb-2 px-2">Sources used:</p>
                                    <div className="flex flex-wrap gap-2 p-2">
                                        {result.sources.map((source, index) => (
                                            <span
                                                key={index}
                                                className="text-xs px-3 py-1 dark:bg-zinc-800/70 bg-gray-200/60 dark:text-green-400 text-green-600  rounded-full border border-border shadow-sm dark:hover:bg-zinc-700/70 transition"
                                            >
                                                {source.title} ({Math.round(source.score * 100)}% match)
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>}
        </>
    )
}