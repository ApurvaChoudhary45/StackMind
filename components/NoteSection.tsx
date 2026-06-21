'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import NoteEditor from './NoteEditor'
import RagSearch from './RagSearch'
import Image from 'next/image'

type Note = {
    id: string
    title: string
    content: string
    created_at: string
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

    const [userNotes, setuserNotes] = useState(notes)

    const [editable, setEditable] = useState(false)
    const [newNoteTitle, setnewNoteTitle] = useState('')
    const [newNoteContent, setnewNoteContent] = useState('')
    const [noteID, setnoteID] = useState('')

    const [askSI, setaskSI] = useState<boolean | null>(false)

    const [mode, setmode] = useState<boolean | null>(false)

    const [expandedNoteId, setexpandedNoteId] =  useState<string | null>(null)

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

    const deleteNote = async (note: Note) => {
        const res = await fetch('/api/deletenote', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                noteId : note.id
            })
        })

        
        setuserNotes(prev => prev.filter(i => i.id !== note.id))

    }

    return (
        <div className="p-8 bg-black/90 min-h-screen text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="text-gray-400 text-sm">Project</p>
                    <h1 className="md:text-2xl font-bold text-green-400 text-sm">{project.name}</h1>
                </div>
                <div className='flex items-center gap-10'>
                <button
                    onClick={() => setIsCreating(true)}
                    className="md:px-4 md:py-2 bg-green-400 px-2 py-1 text-black font-semibold rounded hover:bg-green-300"
                >
                    + New Note
                </button>
                <button className='md:bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 hover:from-teal-600 hover:to-green-400 transition-all duration-300 rounded-2xl p-2 flex items-center' onClick={() => setaskSI(true)}>
                    <Image src={`/Ailogo.png`} alt='No Logo' height={50} width={50} className='md:h-7 md:w-7' />
                    <span className='md:text-xl hidden md:block'>Ask AI</span>
                </button>
                </div>
            </div>

            {isCreating && (
                <div className="mb-8 border border-zinc-700 rounded-lg p-6">
                    <input
                        type="text"
                        placeholder="Note title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-700 text-white text-xl font-semibold mb-4 pb-2 focus:outline-none focus:border-green-400"
                    />
                    <NoteEditor content={content} onChange={setContent} />
                    <div className="flex gap-3 justify-end mt-4">
                        <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-400 hover:text-white">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-4 py-2 bg-green-400 text-black font-semibold rounded disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Note'}
                        </button>
                    </div>
                </div>
            )}

            {editable && <div className="mb-8 border border-zinc-700 rounded-lg p-6">
                <input
                    type="text"
                    placeholder="Note Title"
                    value={newNoteTitle}
                    onChange={(e) => setnewNoteTitle(e.target.value)}
                    className="w-full bg-transparent border-b border-zinc-700 text-white text-xl font-semibold mb-4 pb-2 focus:outline-none focus:border-green-400"
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newNoteContent}
                    onChange={(e) => setnewNoteContent(e.target.value)}
                    className="w-full bg-black/50 border border-zinc-700 text-white rounded p-2 mb-3 focus:outline-none focus:border-green-400"
                />

                <div className="flex gap-3 justify-end">
                    <button onClick={() => setEditable(false)} className="px-4 py-2 text-gray-400 hover:text-white">
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

            <div className="grid grid-cols-1 gap-4">
                {userNotes.map((note) => (
                    <div key={note.id} className="border border-zinc-700 rounded-lg p-4 hover:border-green-400/50 transition-colors grid grid-cols-2">
                        <div className='flex flex-col'>
                            <h2 className="font-semibold text-green-400 text-lg">{note.title}</h2>
                            <div
                                className={`text-gray-400 text-sm mt-1 prose prose-invert max-w-none line-clamp-3 ${expandedNoteId === note.id ? '' : 'line-clamp-3'}`}
                                dangerouslySetInnerHTML={{ __html: note.content }}
                            />
                            <button
                                className="text-green-400 text-xs mt-2 hover:text-green-500 self-start"
                                onClick={() => setexpandedNoteId(expandedNoteId === note.id ? null : note.id)}
                            >
                                {expandedNoteId === note.id ? "Show less" : "View more"}
                            </button>
                        </div>
                        <div className='flex justify-end gap-3'>
                            <button className='text-blue-500 hover:text-blue-600' onClick={() => canWeEdit(note)}>Edit</button>
                            <button className='text-red-500 hover:text-red-600' onClick={() => deleteNote(note)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {askSI && <div className='fixed inset-0 flex justify-center items-center bg-black/80'>
                <RagSearch userId={userId} askSI = {askSI} setaskSI = {setaskSI}/>


            </div>}
        </div>
    )
}

export default NoteSection
