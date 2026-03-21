'use client'

import React from 'react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import NoteEditor from './NoteEditor'


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
    

    const handleSave = async () => {
        if (!title.trim()) return

        setLoading(true)

        await supabase.from('notes').insert({
            title,
            content,
            project_id: project.id,
            user_id: userId
        })

        setTitle('')
        setContent('')
        setIsCreating(false)
        setLoading(false)
        router.refresh()
    }

    const deleteNote = async(note : Note)=>{
        console.log(note.id)
        await supabase.from('notes').delete().eq('id', note.id)
        setuserNotes(prev=>prev.filter(i=> i.id !== note.id))

    }

    return (
        <div className="p-8 bg-black/90 min-h-screen text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="text-gray-400 text-sm">Project</p>
                    <h1 className="md:text-2xl font-bold text-green-400 text-lg">{project.name}</h1>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="md:px-4 md:py-2 bg-green-400 px-2 py-1 text-black font-semibold rounded hover:bg-green-300"
                >
                    + New Note
                </button>
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

            {userNotes.length === 0 && !isCreating && (
                <p className="text-gray-400 text-center mt-20">No notes yet. Create your first one!</p>
            )}

            <div className="grid grid-cols-1 gap-4">
                {userNotes.map((note) => (
                    <div key={note.id} className="border border-zinc-700 rounded-lg p-4 hover:border-green-400/50 transition-colors grid grid-cols-2">
                        <div className='flex flex-col'>
                        <h2 className="font-semibold text-green-400 text-lg">{note.title}</h2>
                        <div
                            className="text-gray-400 text-sm mt-1 prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: note.content }}
                        />
                        </div>
                        <div className='flex justify-end gap-3'>
                        <button className='text-red-500 hover:text-red-600' onClick={()=>deleteNote(note)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NoteSection
