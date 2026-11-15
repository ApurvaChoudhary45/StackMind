'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NoteEditor from './NoteEditor'
import RagSearch from './RagSearch'
import Image from 'next/image'
import AskAIDrawer from './AskAI'
import UpgradeModal from './UpgradeModal'



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
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showUpgrade, setShowUpgrade] = useState<boolean | null>(null)
    const [upgradeReason, setUpgradeReason] = useState('')

    const [userNotes, setuserNotes] = useState<Note[]>(notes ?? []);

    const [newNoteTitle, setnewNoteTitle] = useState('')
    const [newNoteContent, setnewNoteContent] = useState('')
    const [noteID, setnoteID] = useState('')

    const [showCofirm, setshowCofirm] = useState(false)

    const [expandedNoteId, setexpandedNoteId] = useState<string | null>(null)

    const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)

    const [showTags, setShowTags] = useState(false)

    const [editLoading, setEditLoading] = useState(false)


    useEffect(() => {
        if (showCofirm) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }
    }, [showCofirm])

    useEffect(() => {
        setuserNotes(notes)
    }, [notes])

    const handleSave = async () => {
        if (!title.trim()) return

        setLoading(true)

        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    projectId: project.id,
                    userId,
                }),
            })

            const data = await res.json()
            console.log(data)

            if (!res.ok) {
                if (data.upgrade) {
                    setUpgradeReason(data.error)
                    setShowUpgrade(true)
                    return
                }

                alert(data.error)
                return
            }

            setTitle('')
            setContent('')
            setIsCreating(false)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Could not save the note. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const editNote = async (id: string) => {
        try {
            setEditLoading(true);

            const response = await fetch('/api/editnote', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteId: id, title: newNoteTitle, content: newNoteContent }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Could not update the note.')

            setuserNotes(prev =>
                prev.map(note =>
                    note.id === id
                        ? {
                            ...note,
                            title: newNoteTitle,
                            content: data.content,
                        }
                        : note
                )
            );

            setnoteID('')
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Could not update the note.')
        } finally {
            setEditLoading(false);
        }
    };

    const canWeEdit = (note: Note) => {
        setnewNoteTitle(note.title)
        setnewNoteContent(note.content)
        setnoteID(note.id)
    }

    const deleteNote = async (noteId: string) => {
        try {
            setLoading(true)
            const response = await fetch('/api/deletenote', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteId })
            })
            if (!response.ok) throw new Error()
            setuserNotes(prev => prev.filter(i => i.id !== noteId))
        } catch {
            alert('Could not delete the note. Please try again.')
        } finally {
            setLoading(false)
            setshowCofirm(false)
            setNoteToDelete(null)
        }
    }

    const isDeleteOn = async (note: Note) => {
        if (localStorage.getItem('confirmDelete') === 'true') {
            setNoteToDelete(note)
            setshowCofirm(true)
        }
        else {
            await deleteNote(note.id)
        }
    }

    useEffect(() => {
        const tagAuto = localStorage.getItem('enableTag')
        if (tagAuto) setShowTags(tagAuto === 'true')
    }, [])


    return (
        <div className="min-h-0 flex-1 overflow-y-auto bg-background p-4 text-foreground sm:p-8">
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

            {userNotes.length === 0 && !isCreating && (
                <p className="text-gray-400 text-center mt-20">No notes yet. Create your first one!</p>
            )}

            <div className="grid grid-cols-1 gap-4 bg-card">
                {userNotes.map((note) => noteID === note.id ? (
                    <form
                        key={note.id}
                        aria-label="Edit note"
                        onSubmit={(event) => {
                            event.preventDefault()
                            if (!editLoading && newNoteTitle.trim()) void editNote(note.id)
                        }}
                        className="min-w-0 space-y-4 rounded-xl border border-green-500/30 bg-background p-4 sm:p-6"
                    >
                        <fieldset disabled={editLoading} className="min-w-0 space-y-4">
                            <label className="block text-sm font-medium text-foreground">
                                Note title
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    value={newNoteTitle}
                                    onChange={(event) => setnewNoteTitle(event.target.value)}
                                    className="mt-2 w-full rounded-lg border border-input-border bg-input px-3 py-2 text-lg font-semibold text-input-text"
                                />
                            </label>

                            <NoteEditor
                                key={note.id}
                                content={newNoteContent}
                                onChange={setnewNoteContent}
                                readOnly={editLoading}
                            />

                            <div className="flex flex-wrap justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setnoteID('')}
                                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-input disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newNoteTitle.trim() || editLoading}
                                    className="rounded-lg bg-green-400 px-4 py-2 text-sm font-semibold text-black hover:bg-green-300 disabled:opacity-50"
                                >
                                    {editLoading ? 'Saving...' : 'Save changes'}
                                </button>
                            </div>
                        </fieldset>
                    </form>
                ) : (
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
                                disabled={editLoading}
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
                                onClick={() => noteToDelete && deleteNote(noteToDelete.id)}
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

            {showUpgrade && <UpgradeModal showUpgrade={showUpgrade} upgradeReason={upgradeReason} setShowUpgrade={setShowUpgrade} />}
        </div>
    )
}

export default NoteSection
