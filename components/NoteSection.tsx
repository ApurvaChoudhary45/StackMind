'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import NoteEditor from './NoteEditor'
import RagSearch from './RagSearch'
import Image from 'next/image'
import AskAIDrawer from './AskAI'

type Note = {
    id: string
    title: string
    content: string
    created_at: string
    tags: string[] | null
}

type Project = {
    id: string
    name: string
}


const NoteSection = ({ project, notes, userId }: {
    project: Project
    notes: Note[]
    userId: string
}) => {
    const supabase = createClient()
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [loading, setLoading] = useState(false)

    const [userNotes, setuserNotes] = useState<Note[]>(notes ?? []);

    const [editable, setEditable] = useState(false)
    const [newNoteTitle, setnewNoteTitle] = useState('')
    const [newNoteContent, setnewNoteContent] = useState('')
    const [noteID, setnoteID] = useState('')

    const [showCofirm, setshowCofirm] = useState(false)

    const [askSI, setaskSI] = useState<boolean | null>(false)

    const [expandedNoteId, setexpandedNoteId] = useState<string | null>(null)

    const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)

    const [showTags, setShowTags] = useState(false)

    const [drawerOpen, setDrawerOpen] = useState(false)


    useEffect(() => {
        if (showCofirm) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }
    }, [showCofirm])

    const handleSave = async () => {
        if (!title.trim()) return
        setLoading(true)

        const res = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                projectId: project.id,
                userId
            })
        })



        if (res.ok) {
            setTitle('')
            setContent('')
            setIsCreating(false)
            router.refresh()
        }

        setLoading(false)
    }

    const canWeEdit = async (note: Note) => {
        setEditable(true)
        const data = await supabase.from('notes').select('*').eq('id', note.id)
        setnewNoteTitle(data?.data?.[0]?.title)
        setnewNoteContent(data?.data?.[0]?.content)
        setnoteID(note.id)

    }

    const editNote = async (id: string) => {
        await supabase.from('notes').update({
            title: newNoteTitle,
            content: newNoteContent
        }).eq('id', id)

        setEditable(false)
    }

    const deleteNote = async () => {
        if (!noteToDelete) return
        try {
            setLoading(true)
            await fetch('/api/deletenote', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteId: noteToDelete.id })
            })
            setuserNotes(prev => prev.filter(i => i.id !== noteToDelete.id))
        } finally {
            setLoading(false)
            setshowCofirm(false)
            setNoteToDelete(null)
        }
    }

    const isDeleteOn = async (note: Note) => {
        if (localStorage.getItem('confirmDelete') === 'true') {
            console.log(localStorage.getItem('confirmDelete'))
            setNoteToDelete(note)
            setshowCofirm(true)
        }
        else {
            setNoteToDelete(note)
            await deleteNote()
        }
    }

    useEffect(() => {
        const tagAuto = localStorage.getItem('enableTag')
        if (tagAuto) setShowTags(tagAuto === 'true')
    }, [])


    return (
        <div className="p-8 bg-background min-h-screen text-white overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="text-text-muted text-sm">Project</p>
                    <h1 className="md:text-2xl font-bold text-green-400 text-sm">{project.name}</h1>
                </div>
                <div className='flex items-center gap-10'>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="md:px-4 md:py-2 bg-green-400 px-2 py-1 text-black font-semibold rounded hover:bg-green-300"
                    >
                        + New Note
                    </button>
                    <AskAIDrawer userId={userId} mode='notes' />
                </div>
            </div>

            {isCreating && (
                <div className="mb-8 border border-zinc-700 rounded-lg p-6">
                    <input
                        type="text"
                        placeholder="Note title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-700 text-input-text text-xl font-semibold mb-4 pb-2 focus:outline-none focus:border-green-400"
                    />
                    <NoteEditor content={content} onChange={setContent} />
                    <div className="flex gap-3 justify-end mt-4">
                        <button onClick={() => setIsCreating(false)} className='text-black dark:text-white hover:text-zinc-500 dark:hover:text-zinc-200'>Cancel</button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-4 py-2 bg-green-400 text-black font-semibold rounded disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <i className="ti ti-loader animate-spin text-base" />
                                    Saving...
                                </>
                            ) : (
                                'Save Note'
                            )}
                        </button>
                    </div>
                </div>
            )}

            {editable && <div className="mb-8 border border-border rounded-lg p-6">
                <input
                    type="text"
                    placeholder="Note Title"
                    value={newNoteTitle}
                    onChange={(e) => setnewNoteTitle(e.target.value)}
                    className="w-full bg-transparent border-b border-zinc-700 text-input-text text-xl font-semibold mb-4 pb-2 focus:outline-none focus:border-green-400"
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newNoteContent}
                    onChange={(e) => setnewNoteContent(e.target.value)}
                    className="w-full dark:bg-black/50 border border-zinc-700 dark:text-white text-black rounded p-2 mb-3 focus:outline-none focus:border-green-400"
                />

                <div className="flex gap-3 justify-end">
                    <button onClick={() => setEditable(false)} className="px-4 py-2 text-gray-400 hover:text-zinc-700 dark:hover:text-white">
                        Cancel
                    </button>
                    <button

                        className="px-4 py-2 bg-green-400 text-black font-semibold rounded hover:bg-green-300" onClick={() => editNote(noteID)}
                    >
                        Edit Note
                    </button>
                </div>
            </div>}


            {userNotes.length === 0 && !isCreating && (
                <p className="text-gray-400 text-center mt-20">No notes yet. Create your first one!</p>
            )}

            <div className="grid grid-cols-1 gap-4 bg-card">
                {userNotes.map((note) => (
                    <div key={note.id} className="border border-border rounded-lg p-4 hover:border-green-400/50 transition-colors flex flex-col gap-3">

                        {/* Note content */}
                        <div className='flex flex-col'>
                            <h2 className="font-semibold text-green-400 text-lg">{note.title}</h2>

                            {/* Tags */}
                            {showTags && note.tags && note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {note.tags.map((tag: string, index: number) => (
                                        <span
                                            key={index}
                                            className="text-xs px-2 py-1 bg-background text-text-muted rounded-full border border-zinc-700"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Content */}
                            <div
                                className={`dark:text-gray-400 text-black text-sm mt-1 prose prose-invert max-w-none overflow-hidden ${expandedNoteId === note.id ? '' : 'line-clamp-3'}`}
                                dangerouslySetInnerHTML={{ __html: note.content }}
                            />
                            <button
                                className="text-green-400 text-xs mt-2 hover:text-green-500 self-start"
                                onClick={() => setexpandedNoteId(expandedNoteId === note.id ? null : note.id)}
                            >
                                {expandedNoteId === note.id ? "Show less ↑" : "View more ↓"}
                            </button>
                        </div>

                        {/* Actions — bottom right on all screen sizes */}
                        <div className='flex justify-end gap-3 pt-2 border-t border-border'>
                            <button
                                className='text-xs font-mono text-blue-500 hover:text-blue-400 border border-blue-500/20 hover:border-blue-400/40 px-3 py-1.5 rounded-lg transition-colors'
                                onClick={() => canWeEdit(note)}
                            >
                                <i className="ti ti-pencil mr-1" />
                                Edit
                            </button>
                            <button
                                className='text-xs font-mono text-red-500 hover:text-red-400 border border-red-500/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-colors'
                                onClick={() => isDeleteOn(note)}
                            >
                                <i className="ti ti-trash mr-1" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {showCofirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-hidden">
                    <div className="bg-background border border-zinc-800 rounded-2xl w-full max-w-sm p-6 overflow-y-auto overscroll-contain">

                        <div className="w-11 h-11 rounded-xl dark:bg-red-950/40 border border-red-400/20 flex items-center justify-center mb-4">
                            <i className="ti ti-trash text-red-400 text-xl" />
                        </div>

                        <p className="text-sm font-medium text-black dark:text-zinc-200 mb-1.5">Delete this note?</p>
                        <p className="text-xs font-mono text-zinc-600 leading-relaxed mb-6">
                            This will permanently delete <span className="dark:text-zinc-300 text-black">"{noteToDelete?.title}"</span> and remove it from search. This action cannot be undone.
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setshowCofirm(false)}
                                className="flex-1 py-2.5 rounded-lg text-sm font-mono font-medium border border-zinc-800 text-zinc-500 hover:text-gray-800 dark:hover:text-zinc-300 hover:border-zinc-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={deleteNote}
                                disabled={loading}
                                className="flex-1 py-2.5 rounded-lg text-sm font-mono font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <i className="ti ti-loader animate-spin text-base" />
                                        Deleting
                                    </>
                                ) : (
                                    'Confirm Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    )
}

export default NoteSection
