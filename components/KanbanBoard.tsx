'use client'

import React, { act } from 'react'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

import { DndContext, DragEndEvent } from '@dnd-kit/core'

import KanbanColumn from './KanbanColumn'

type Bug = {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: string
}

type Props = {
  bugs: Bug[],
  projectId: string,
  userId: string
}


const columns = [
  { id: 'open', title: 'Open', color: 'bg-red-400' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-400' },
  { id: 'fixed', title: 'Fixed', color: 'bg-green-400' },
]

export default function KanbanBoard({ bugs, projectId, userId }: Props) {
  const [allBugs, setallBugs] = useState(bugs)
  const [isCreating, setisCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const supabase = createClient()
  const router = useRouter()

  async function handleDragEvent(event: DragEndEvent) {

    const { active, over } = event

    if (!over) return

    if (active.id == over.id) return

    const newStatus = over.id as string

    setallBugs(prev => prev.map(bug => bug.id == active.id ? { ...bug, status: newStatus } : bug))


    await supabase.from('bugs').update({ status: newStatus }).eq('id', active.id)

  }


  async function handleCreateBug() {
    if (!title.trim()) return

    const { data } = await supabase.from('bugs').insert({
      title,
      description,
      priority,
      status: 'open',
      project_id: projectId,
      user_id: userId

    }).select().single()


    if (data) {
      setallBugs(prev => [...prev, data])
      setTitle('')
      setDescription('')
      setPriority('medium')
      setisCreating(false)
    }
  }



  return (
    <div className="p-8 bg-black/90 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-400">Bug Tracker</h1>
        <button
          onClick={() => setisCreating(true)}
          className="px-4 py-2 bg-green-400 text-black font-semibold rounded hover:bg-green-300"
        >
          + New Bug
        </button>
      </div>

      {isCreating && (
        <div className="mb-8 border border-zinc-700 rounded-lg p-6">
          <input
            type="text"
            placeholder="Bug title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-zinc-700 text-white text-xl font-semibold mb-4 pb-2 focus:outline-none focus:border-green-400"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-black/50 border border-zinc-700 text-white rounded p-2 mb-4 focus:outline-none focus:border-green-400 resize-none h-20"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="bg-zinc-800 text-white border border-zinc-700 rounded p-2 mb-4 focus:outline-none focus:border-green-400"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setisCreating(false)} className="px-4 py-2 text-gray-400 hover:text-white">
              Cancel
            </button>
            <button
              onClick={handleCreateBug}
              className="px-4 py-2 bg-green-400 text-black font-semibold rounded hover:bg-green-300"
            >
              Create Bug
            </button>
          </div>
        </div>
      )}

      <DndContext onDragEnd={handleDragEvent}>
        <div className="flex gap-4">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              bugs={allBugs.filter(bug => bug.status === column.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  )
}
