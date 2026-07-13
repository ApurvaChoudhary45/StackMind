'use client'

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { s } from "framer-motion/client"
import GlobalSearch from "./GlobalSearch"
import GithubImport from '@/components/GithubImport'
import AnalyzeSnippet from "./AnalyzeSnippet"

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
    const [language, setLanguage] = useState('')
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
    const [autoSave, setAutoSave] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [textResize, setTextResize] = useState('')
    const [newNoteId, setNewNoteId] = useState('')
    const [analyze, setAnalyze] = useState(false)
    const [loading, setloading] = useState(false)

    async function handleCreate() {
        setloading(true)
        try {
            const data = await fetch('/api/add-snippet', {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ title, code, language, description, project_id: projectId, user_id: userId, newNoteId })
            })
        } catch (error) {
            console.log(error)
        }
        finally {
            setloading(false)
        }
        setTitle('')
        setCode('')
        setDescription('')
        setNewNoteId('')
        setIsCreating(false)

        router.refresh()
    }

    async function deletNote(snippet: Snippet) {
        await supabase.from('snippets').delete().eq('id', snippet.id)
        setAllSnippets(prev => prev.filter(i => i.id !== snippet.id))
    }

    async function handleCopy(snippet: Snippet) {
        await navigator.clipboard.writeText(snippet.code)
        setCopied(snippet.id)
        setTimeout(() => {
            setCopied(null)
        }, 2000);
    }

    async function cancelNewSnippet() {
        await supabase.from('snippets').delete().eq('id', newNoteId)
        setIsCreating(false)
        
    }

    const filtered = allSnippets.filter(s => filterLang || s.language === filterLang).filter(s => s.title.toLowerCase().includes(search.toLowerCase()))

    function selectNote(snippet: Snippet) {
        setnewId(snippet.id)
        setnewTitle(snippet.title)
        setnewDescription(snippet.description)
        setnewLanguage(snippet.language)
        setnewCode(snippet.code)
    }

    async function createNewNote() {
        setIsCreating(true)
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("No user found:", userError);
            return;
        }

        // Insert a new note tied to this user
        const { data, error } = await supabase
            .from("snippets")
            .insert({ title: "", language: "", description: "", code: "", user_id: user.id, project_id: projectId })
            .select();

        if (error) {
            console.error("Error creating note:", error);
        } else {
            console.log(data[0])
            setNewNoteId(data[0]?.id); // store the new noteId in state

        }
    }

    const saveEditedNote = async () => {

        await supabase.from('snippets').update({
            title: newTitle,
            description: newDescription,
            language: newLanguage,
            code: newCode
        })
            .eq('id', newId)

        setAllSnippets(prev => prev.map(bug => bug.id === newId ? { ...bug, title: newTitle, description: newDescription, language: newLanguage, code: newCode } : bug))
        setisEditing(false)
        router.refresh()
    }


    useEffect(() => {
        const saveAuto = localStorage.getItem('autoSaveEnabled')
        if (saveAuto) setAutoSave(saveAuto === 'true')

        const textSize = localStorage.getItem('fontSize')
        if (textSize === 'small') {
            setTextResize('13')
        }
        else if (textSize === 'medium') {
            setTextResize('15')
        }
        else if (textSize === 'large') {
            setTextResize('17')
        }

        const newLang = localStorage.getItem('defaultLanguage')?.toLowerCase()
        if (newLang) {
            // setnewLanguage(newLang)
            setLanguage(newLang)
        }
    }, [])

    useEffect(() => {
        if (!autoSave || !newNoteId) return;

        const timer = setTimeout(async () => {
            setIsSaving(true)
            const { error } = await supabase
                .from("snippets")
                .update({ code: code })
                .eq("id", newNoteId);

            if (error) console.error("Save failed:", error);
            else console.log("Note saved successfully");
            setIsSaving(false)
        }, 1000);

        return () => clearTimeout(timer);
    }, [code, autoSave, newNoteId]);

    useEffect(() => {
        if (!autoSave || !newId) return;

        const timer = setTimeout(async () => {
            setIsSaving(true)
            const { error } = await supabase
                .from("snippets")
                .update({ code: newCode })
                .eq("id", newId);

            if (error) console.error("Save failed:", error);
            else console.log("Note saved successfully");
            setIsSaving(false)
        }, 1000);

        return () => clearTimeout(timer);
    }, [newCode, autoSave, newId]);


    return (
        <div className="p-8 min-h-screen bg-background dark:text-white">
            <div className="flex justify-between items-center">
                <h1 className="text-green-400 md:text-2xl text-lg">Snippet Library</h1>
                <div className="flex justify-between items-center gap-5">
                    <AnalyzeSnippet analyze={analyze} setAnalyze={setAnalyze} userId={userId} />
                    <button className="py-2 px-2 rounded-lg font-semibold bg-green-400 text-black text-sm" onClick={createNewNote}>
                        + New Snippet
                    </button>


                </div>

            </div>
            <div className="flex gap-3 mb-6 mt-8">
                <input
                    type="text"
                    placeholder="Search snippets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-card border border-border text-input-text rounded p-2 focus:outline-none focus:border-green-400"
                />
                <select
                    value={filterLang}
                    onChange={(e) => setFilterLang(e.target.value)}
                    className="bg-card dark:text-white text-black border border-border rounded p-2 focus:outline-none focus:border-green-400"
                >
                    <option value="all">{newLanguage}</option>
                    {languages.map(l => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
            </div>

            {isCreating && <div className="mb-8 border border-border rounded-lg p-6">
                <input
                    type="text"
                    placeholder="Snippet title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-card border-b border-border text-input-text text-md p-2 font-semibold mb-4 focus:outline-none focus:border-green-400"
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-card border border-border text-input-text rounded p-2 mb-3 focus:outline-none focus:border-green-400"
                />
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-background text-input-text border border-border rounded p-2 mb-3 focus:outline-none focus:border-green-400"
                >
                    {languages.map(l => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
                <textarea
                    placeholder="Paste your code here..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={`w-full bg-background border border-border dark:text-green-400 text-green-700 font-mono rounded p-3 mb-4 focus:outline-none focus:border-green-400 resize-none h-40 text-[${textResize}px]`}
                />
                {autoSave && (
                    <div className="flex gap-2 items-center mb-3">
                        <i className={`ti ti-loader text-green-400 ${isSaving ? 'animate-spin' : 'opacity-80'}`} />
                        <p className="text-xs font-mono text-zinc-500">
                            {isSaving ? ('Saving...') : autoSave ? ('Auto Save on') : ('Auto Save off')}
                        </p>
                    </div>
                )}
                <div className="flex gap-3 justify-end">
                    <button onClick={cancelNewSnippet} className="px-4 py-2 dark:text-gray-400 dark:hover:text-white hover:text-gray-700">
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="px-4 py-2 bg-green-400 text-black font-semibold rounded hover:bg-green-300"
                    >
                        {loading ? (
                            <>
                                <i className="ti ti-loader animate-spin text-base" />
                                Saving...
                            </>
                        ) : (
                            'Save Snippet'
                        )}
                    </button>
                </div>
            </div>}

            {isEditing && <div className="mb-8 border border-border rounded-lg p-6">
                <input
                    type="text"
                    placeholder="Snippet title"
                    value={newTitle}
                    onChange={(e) => setnewTitle(e.target.value)}
                    className="w-full bg-transparent border-b border-border text-input-text text-xl font-semibold mb-4 pb-2 focus:outline-none focus:border-green-400"
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newDescription}
                    onChange={(e) => setnewDescription(e.target.value)}
                    className="w-full bg-background border border-border dark:text-white rounded p-2 mb-3 focus:outline-none focus:border-green-400"
                />
                <select
                    value={newLanguage}
                    onChange={(e) => setnewLanguage(e.target.value)}
                    className="bg-background dark:text-white border border-border rounded p-2 mb-3 focus:outline-none focus:border-green-400"
                >
                    {languages.map(l => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
                <textarea
                    placeholder="Paste your code here..."
                    value={newCode}
                    onChange={(e) => setnewCode(e.target.value)}
                    className="w-full bg-background border border-border text-green-400 font-mono rounded p-3 mb-4 focus:outline-none focus:border-green-400 resize-none h-40"
                />
                {autoSave && (
                    <div className="flex gap-2 items-center mb-3">
                        <i className={`ti ti-loader text-green-400 ${isSaving ? 'animate-spin' : 'opacity-80'}`} />
                        <p className="text-xs font-mono text-zinc-500">
                            {isSaving ? ('Saving...') : autoSave ? ('Auto Save on') : ('Auto Save off')}
                        </p>
                    </div>
                )}
                <div className="flex gap-3 justify-end">
                    <button onClick={() => setisEditing(false)} className="px-4 py-2 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                        Cancel
                    </button>
                    <button
                        onClick={saveEditedNote}
                        disabled={loading}
                        className="px-4 py-2 bg-green-400 text-black font-semibold rounded hover:bg-green-300"
                    >
                        {loading ? (
                            <>
                                <i className="ti ti-loader animate-spin text-base" />
                                Saving...
                            </>
                        ) : (
                            'Edit Note'
                        )}
                    </button>
                </div>
            </div>}

            {filtered.length === 0 && (
                <p className="text-gray-400 text-center mt-20">No snippets found.</p>
            )}

            <div className="grid grid-cols-1 gap-4">
                {filtered.map(snippet => (

                    <div key={snippet.id} className="border border-border rounded-lg p-4 hover:border-green-400/50 transition-colors">
                        <div className="md:flex md:justify-between md:flex-row items-start mb-2 flex flex-col gap-2">
                            <div>
                                <h2 className="font-semibold dark:text-white ">{snippet.title}</h2>
                                {snippet.description && (
                                    <p className="dark:text-gray-400 text-gray-700 text-sm">{snippet.description}</p>
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
                                    onClick={() => { setisEditing(true), selectNote(snippet) }}
                                    className="text-xs px-3 py-1 border border-blue-800 rounded hover:border-blue-700 text-blue-600 hover:text-blue-400 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deletNote(snippet)}
                                    className="text-xs px-3 py-1 border border-red-800 rounded hover:border-red-700 text-red-600 hover:text-red-400 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <pre className="bg-card rounded p-3 overflow-x-auto max-h-100">
                            <code className="dark:text-green-400 text-green-600 font-mono text-sm whitespace-pre-wrap">{snippet.code}</code>
                        </pre>
                    </div>
                ))}

            </div>
        </div>
    )
}
