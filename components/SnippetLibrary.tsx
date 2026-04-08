'use client'

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { s } from "framer-motion/client"
import GlobalSearch from "./GlobalSearch"


type Snippet = {
    id: string,
    title: string,
    code: string,
    language: string,
    description: string
}

type UpdatedSnippet = {
    id: string,
    title: string,
    code: string,
    language: string,
    description: string
}

const languages = ['javascript', 'typescript', 'python', 'sql', 'bash', 'css', 'html', 'other']

export default function SnippetLibrary({ snippets, projectId, userId }: {
    snippets: Snippet[]
    projectId: string
    userId: string
}) {
    const [allSnippets, setAllSnippets] = useState(snippets)
    const [isCreating, setIsCreating] = useState(false)
    const [search, setSearch] = useState('')
    const [filterLang, setFilterLang] = useState('all')
    const [title, setTitle] = useState('')
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('javascript')
    const [description, setDescription] = useState('')
    const [copied, setCopied] = useState<string | null>(null)
    const supabase = createClient()
    const [isEditing, setisEditing] = useState(false)
    const [newTitle, setnewTitle] = useState('')
    const [newDescription, setnewDescription] = useState('')
    const [newLanguage, setnewLanguage] = useState('')
    const [newCode, setnewCode] = useState('')
    const [newId, setnewId] = useState('')
    const router = useRouter()

    async function handleCreate() {
        if (!title.trim() || !code.trim()) return

        const { data } = await supabase.from('snippets').insert({
            title,
            code,
            language,
            description,
            project_id: projectId,
            user_id: userId
        })

        if (data) {
            setAllSnippets(prev => [...prev, data])
            setTitle('')
            setCode('')
            setDescription('')
            setLanguage('javascript')
            

        }
        setIsCreating(false)
        router.refresh()
    }

    async function deletNote(snippet:Snippet) {
        await supabase.from('snippets').delete().eq('id', snippet.id)
        setAllSnippets(prev => prev.filter(i=> i.id !== snippet.id))
    }

    async function handleCopy(snippet: Snippet) {
        await navigator.clipboard.writeText(snippet.code)
        setCopied(snippet.id)
        setTimeout(() => {
            setCopied(null)
        }, 2000);
    }

    const filtered = allSnippets.filter(s => filterLang || s.language === filterLang).filter(s => s.title.toLowerCase().includes(search.toLowerCase()))

    function selectNote(snippet:Snippet) {
        setnewId(snippet.id)
        setnewTitle(snippet.title)
        setnewDescription(snippet.description)
        setnewLanguage(snippet.language)
        setnewCode(snippet.code)
    }

    

    const saveEditedNote = async ()=>{
        await supabase.from('snippets').update({
            title :newTitle,
            description : newDescription,
            language : newLanguage,
            code : newCode
        })
        .eq('id', newId)

        setAllSnippets(prev=> prev.map(bug=> bug.id === newId ? {...bug, title : newTitle, description : newDescription, language : newLanguage, code : newCode} : bug))
        setisEditing(false)
    }
    
    return (
        <div className="p-8 min-h-screen bg-black/90 text-white">
            <div className="flex justify-between items-center">
                <h1 className="text-green-400 text-2xl">Snippet Library</h1>
                <button className="py-2 px-2 rounded-xl font-semibold bg-green-400 text-black text-sm"  onClick={()=>setIsCreating(true)}>
                    + New Snippet
                </button>
            </div>
            <div className="flex gap-3 mb-6 mt-8">
                <input
                    type="text"
                    placeholder="Search snippets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white rounded p-2 focus:outline-none focus:border-green-400"
                />
                <select
                    value={filterLang}
                    onChange={(e) => setFilterLang(e.target.value)}
                    className="bg-zinc-900 text-white border border-zinc-700 rounded p-2 focus:outline-none focus:border-green-400"
                >
                    <option value="all">All Languages</option>
                    {languages.map(l => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
            </div>

            {isCreating && <div className="mb-8 border border-zinc-700 rounded-lg p-6">
                <input
                    type="text"
                    placeholder="Snippet title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent border-b border-zinc-700 text-white text-xl font-semibold mb-4 pb-2 focus:outline-none focus:border-green-400"
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-700 text-white rounded p-2 mb-3 focus:outline-none focus:border-green-400"
                />
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-zinc-800 text-white border border-zinc-700 rounded p-2 mb-3 focus:outline-none focus:border-green-400"
                >
                    {languages.map(l => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
                <textarea
                    placeholder="Paste your code here..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-green-400 font-mono rounded p-3 mb-4 focus:outline-none focus:border-green-400 resize-none h-40"
                />
                <div className="flex gap-3 justify-end">
                    <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-400 hover:text-white">
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-green-400 text-black font-semibold rounded hover:bg-green-300"
                    >
                        Save Snippet
                    </button>
                </div>
            </div>}

            {isEditing && <div className="mb-8 border border-zinc-700 rounded-lg p-6">
                <input
                    type="text"
                    placeholder="Snippet title"
                    value={newTitle}
                    onChange={(e) => setnewTitle(e.target.value)}
                    className="w-full bg-transparent border-b border-zinc-700 text-white text-xl font-semibold mb-4 pb-2 focus:outline-none focus:border-green-400"
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newDescription}
                    onChange={(e) => setnewDescription(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-700 text-white rounded p-2 mb-3 focus:outline-none focus:border-green-400"
                />
                <select
                    value={newLanguage}
                    onChange={(e) => setnewLanguage(e.target.value)}
                    className="bg-zinc-800 text-white border border-zinc-700 rounded p-2 mb-3 focus:outline-none focus:border-green-400"
                >
                    {languages.map(l => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
                <textarea
                    placeholder="Paste your code here..."
                    value={newCode}
                    onChange={(e) => setnewCode(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-green-400 font-mono rounded p-3 mb-4 focus:outline-none focus:border-green-400 resize-none h-40"
                />
                <div className="flex gap-3 justify-end">
                    <button onClick={() => setisEditing(false)} className="px-4 py-2 text-gray-400 hover:text-white">
                        Cancel
                    </button>
                    <button
                        onClick={saveEditedNote}
                        className="px-4 py-2 bg-green-400 text-black font-semibold rounded hover:bg-green-300"
                    >
                        Edit Snippet
                    </button>
                </div>
            </div>}

            {filtered.length === 0 && (
                <p className="text-gray-400 text-center mt-20">No snippets found.</p>
            )}

            <div className="grid grid-cols-1 gap-4">
                {filtered.map(snippet => (

                    <div key={snippet.id} className="border border-zinc-700 rounded-lg p-4 hover:border-green-400/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h2 className="font-semibold text-white">{snippet.title}</h2>
                                {snippet.description && (
                                    <p className="text-gray-400 text-sm">{snippet.description}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-zinc-800 text-green-400 px-2 py-1 rounded font-mono">
                                    {snippet.language}
                                </span>
                                <button
                                    onClick={() => handleCopy(snippet)}
                                    className="text-xs px-3 py-1 border border-zinc-600 rounded hover:border-green-400 text-gray-400 hover:text-green-400 transition-colors"
                                >
                                    {copied === snippet.id ? '✓ Copied!' : 'Copy'}
                                </button>
                                <button
                                    onClick={()=>{setisEditing(true), selectNote(snippet)}}
                                    className="text-xs px-3 py-1 border border-blue-800 rounded hover:border-blue-700 text-blue-600 hover:text-blue-400 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={()=>deletNote(snippet)}
                                    className="text-xs px-3 py-1 border border-red-800 rounded hover:border-red-700 text-red-600 hover:text-red-400 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <pre className="bg-zinc-900 rounded p-3 overflow-x-auto">
                            <code className="text-green-400 font-mono text-sm">{snippet.code}</code>
                        </pre>
                    </div>
                ))}

            </div>
        </div>
    )
}
