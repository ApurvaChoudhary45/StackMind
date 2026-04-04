'use client'


import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEdgeStore } from '@/lib/edgestore'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useMemo } from 'react'
import KanbanColumn from './KanbanColumn'

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
      console.log(uploadURL)
      setUrl(uploadURL)
      setLoading(false)
      setisErrorScreen(false)
    }
  }

  async function handleCreateBug() {
    if (!title.trim()) return

    const { data } = await supabase.from('bugs').insert({
      title,
      description,
      priority,
      status: 'open',
      project_id: projectId,
      user_id: userId,
      img_src: url

    }).select().single()


    if (data) {
      setallBugs(prev => [...prev, data])
      setTitle('')
      setDescription('')
      setPriority('medium')
      setisCreating(false)
    }
  }

  
  const handlepreview = (e: any) => {
    const file = e.target.files[0]
    setFile(file)
    if(file){
      setPreview(URL.createObjectURL(file))
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
          <div className='flex justify-between items-center'>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="bg-zinc-800 text-white border border-zinc-700 rounded md:p-2 md:mb-4 py-2 focus:outline-none focus:border-green-400"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <button className='md:px-4 md:py-2 px-2 py-2 bg-green-400 text-black font-semibold rounded hover:bg-green-300' onClick={() => setisErrorScreen(true)}>+ Add a screenshot</button>

          </div>
          {isErrorScreen && (
            <div className='fixed inset-0 flex justify-center items-center bg-black/50'>
              <div className='bg-zinc-900 h-[80vh] w-1/2 rounded-2xl p-6 flex flex-col gap-4'>

                {/* Header */}
                <div className='flex justify-between items-center'>
                  <h1 className='text-green-400 font-bold text-lg'>Bug Report</h1>
                  <button className='text-gray-500 hover:text-white transition-colors text-sm' onClick={()=>setisErrorScreen(false)}>✕ Close</button>
                </div>

                {/* Upload Area */}
                <div className='border-2 border-dashed border-zinc-700 hover:border-green-400/50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group'>
                  <div className='w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-green-400/10 flex items-center justify-center transition-colors'>
                    <span className='text-xl'>📎</span>
                  </div>
                  <div className='text-center'>
                    <p className='text-white text-sm font-medium'>Add screenshot here</p>
                    <p className='text-gray-500 text-xs mt-1'>PNG, JPG up to 5MB</p>
                  </div>
                  <button className='relative bg-black/20 rounded-xl p-2 text-sm text-white overflow-hidden border-green-500 border-2 hover:text-green-400 '>
                    <input type="file"  onChange={handlepreview} className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'/>
                    Browse files
                  </button>
                </div>

                {/* Preview Area */}
                <div className='flex-1 border border-zinc-700 rounded-xl overflow-hidden relative bg-zinc-800/50'>
                  {preview ? <div>
                    <img src={preview} alt="no Img" className='w-full' />
                  </div> : <div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
                    <span className='text-3xl'>🖼️</span>
                    <p className='text-gray-600 text-xs'>Screenshot preview will appear here</p>
                  </div>}
                </div>

                {/* Actions */}
                <div className='flex justify-end gap-3'>
                  <button className='px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors' onClick={()=>setisErrorScreen(false)}>
                    Cancel
                  </button>
                  <button className='px-4 py-2 bg-green-400 text-black font-semibold text-sm rounded-lg hover:bg-green-300 transition-colors' onClick={handleUpload}>
                    Attach Screenshot
                  </button>
                </div>

              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end mt-5">
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
