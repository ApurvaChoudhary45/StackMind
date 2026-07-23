'use client'


import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEdgeStore } from '@/lib/edgestore'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useMemo } from 'react'
import KanbanColumn from './KanbanColumn'
import RagSearch from './RagSearch'
import AskAIDrawer from './AskAI'

type Bug = {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: string,
  img_src : string 
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
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState('')
  const { edgestore } = useEdgeStore();
  const [isErrorScreen, setisErrorScreen] = useState(false)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [askSI, setaskSI] = useState<boolean | null>(false)

  useEffect(() => {
    const channel = supabase
      .channel('bugs-channel')
      .on(
        'postgres_changes',
        {
          event: '*', // listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'bugs',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setallBugs(prev => [payload.new as Bug, ...prev])
          }
          if (payload.eventType === 'UPDATE') {
            setallBugs(prev =>
              prev.map(bug => bug.id === payload.new.id ? payload.new as Bug : bug)
            )
          }
          if (payload.eventType === 'DELETE') {
            setallBugs(prev => prev.filter(bug => bug.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    // cleanup when component unmounts
    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, supabase])

  async function handleDragEvent(event: DragEndEvent) {

    const { active, over } = event

    if (!over) return

    if (active.id == over.id) return

    const newStatus = over.id as string

    setallBugs(prev => prev.map(bug => bug.id == active.id ? { ...bug, status: newStatus } : bug))

    await supabase.from('bugs').update({ status: newStatus }).eq('id', active.id)

  }

  const handleUpload = async()=>{
    setLoading(true)
    let uploadURL = url
    if(file){
      const upload = await edgestore.publicFiles.upload({
        file
      })
      uploadURL = upload?.url
      setUrl(uploadURL)
      setLoading(false)
      setisErrorScreen(false)
    }
  }

  async function handleCreateBug() {
    try {
      if (!title.trim()) return

    const res = await fetch('/api/add-bug', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            description,
            priority,
            project_id: projectId,
        }),
    })

    const data = await res.json()

    if (!res.ok) {
        alert(data.error)
        return
    }
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
    setTitle('')
    setDescription('')
    setPriority('medium')
    setisCreating(false)
}
  
  const handlepreview = (e: any) => {
    const file = e.target.files[0]
    setFile(file)
    if(file){
      setPreview(URL.createObjectURL(file))
    }
    
  }

  return (
    <div className="p-8 bg-background h-screen overflow-y-auto">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-400">Bug Tracker</h1>
        <div className='flex gap-10'>
        <button
          onClick={() => setisCreating(true)}
          className="px-4 py-2 bg-green-400 text-black font-semibold rounded hover:bg-green-300"
        >
          + New Bug
        </button>
        <AskAIDrawer userId={userId} mode='bugs'/>
</div>
      </div>

      {isCreating && (
        <div className="mb-8 border border-border rounded-lg p-6">
          <input
            type="text"
            placeholder="Bug title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full dark:bg-transparent border-b border-border text-input-text text-xl font-semibold mb-4 pb-2 focus:outline-none focus:border-green-400"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full dark:bg-black/50 bg-card border border-border dark:text-white text-black rounded p-2 mb-4 focus:outline-none focus:border-green-400 resize-none h-20"
          />
          <div className='flex justify-between items-center'>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="bg-card dark:text-white text-black border border-border rounded md:p-2 md:mb-4 py-2 focus:outline-none focus:border-green-400"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

          </div>
          
          <div className="flex gap-3 justify-end mt-5">
            <button onClick={() => setisCreating(false)} className="px-4 py-2 dark:text-gray-400 dark:hover:text-white text-black hover:text-gray-500">
              Cancel
            </button>
            <button
                            onClick={handleCreateBug}
                            disabled={loading}
                            className="px-4 py-2 bg-green-400 text-black font-semibold rounded disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <i className="ti ti-loader animate-spin text-base" />
                                    Adding...
                                </>
                            ) : (
                                'Add Bug'
                            )}
                        </button>
          </div>
        </div>
      )}
      {askSI && <div className='fixed inset-0 flex justify-center items-center bg-black/80'>
                <RagSearch userId={userId} askSI={askSI} setaskSI={setaskSI} mode='bugs' />


            </div>}
      

      <DndContext onDragEnd={handleDragEvent}>
        <div className="md:flex md:gap-4 grid grid-cols-1 gap-4">
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
