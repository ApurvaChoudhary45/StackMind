'use client'

import { useState } from 'react'

import Image from 'next/image'
type Source = {
    title: string
    score: number
}

type RagSearchProps = {
    userId: string
    askSI: boolean
    setaskSI: React.Dispatch<React.SetStateAction<boolean>>
}

const RagSearch = ({ userId, askSI, setaskSI }: RagSearchProps) => {
    const [query, setQuery] = useState('')
    const [answer, setAnswer] = useState('')
    const [sources, setSources] = useState<Source[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async () => {
        if (!query.trim()) return
        setLoading(true)
        setAnswer('')
        setSources([])

        const res = await fetch('/api/rag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, userId })
        })

        const data = await res.json()
        setAnswer(data.answer)
        setSources(data.sources)
        setLoading(false)
    }

    return (
        <div className="md:p-7  border border-zinc-700 rounded-xl bg-black/40 backdrop-blur-md shadow-lg transition hover:shadow-green-400/20 w-3/4" >
            <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center gap-2">
                    <Image
                        src="/Ailogo.png"
                        alt="AI Logo"
                        height={40}
                        width={40}
                        className="object-contain"
                    />
                    <h2 className="text-green-400 font-semibold text-lg tracking-wide">
                        Ask your notes
                    </h2>
                </div>
                <span
                    className="text-md hover:text-green-400 cursor-pointer"
                    onClick={(e) => {
                        setaskSI(false);
                        e.stopPropagation();
                    }}
                >
                    X
                </span>
            </div>


            {/* Input */}
            <div className="flex gap-2 mb-5 pt-5 md:flex-row flex-col">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Ask anything about your notes..."
                    className="flex-1 bg-black/60 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400/70 focus:border-green-400 transition"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-5 py-2 bg-gradient-to-r from-green-400 to-green-500 text-black font-semibold rounded-lg shadow-md hover:shadow-green-400/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Thinking...' : 'Ask'}
                </button>
            </div>

            {/* Answer */}
            {answer && (
                <div className="mb-5 p-5 bg-zinc-900/70 border border-zinc-700 rounded-xl shadow-inner">
                    <p className="text-gray-300 text-sm leading-relaxed">{answer}</p>
                </div>
            )}

            {/* Sources */}
            {sources.length > 0 && (
                <div>
                    <p className="text-gray-500 text-xs mb-2">Sources used:</p>
                    <div className="flex flex-wrap gap-2">
                        {sources.map((source, index) => (
                            <span
                                key={index}
                                className="text-xs px-3 py-1 bg-zinc-800/70 text-green-400 rounded-full border border-zinc-700 shadow-sm hover:bg-zinc-700/70 transition"
                            >
                                {source.title} ({Math.round(source.score * 100)}% match)
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>

    )
}

export default RagSearch