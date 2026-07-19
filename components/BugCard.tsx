'use client'
import React from 'react'

import { useDraggable } from "@dnd-kit/core"

import { CSS } from "@dnd-kit/utilities"

import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'

type Bug = {
    id: string
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    status: string,
    img_src: string
}

const priorityColors = {
    low: 'text-blue-400',
    medium: 'text-yellow-400',
    high: 'text-red-400'
}

export default function BugCard({ bug }: { bug: Bug }) {

    const [loading, setloading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [analysis, setanalysis] = useState('')

    const [closeAI, setcloseAI] = useState(false)

    const supabase = createClient()

    const analyze = async () => {
        setloading(true)
        setIsOpen(true)
        try {
            const data = await fetch('/api/ai/summarize-bug', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: bug.title, description: bug.description })
            })
            const res = await data.json()
            setanalysis(res.analysis)
            console.log(res.analysis)
            setcloseAI(true)
        } catch (error) {
            console.log(error)
        }
        finally{
            setloading(false)
        }

    }

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: bug.id
    })

    const style = {
        transform: CSS.Translate.toString(transform)
    }

    const viewError = (bug: Bug) => {
        setIsOpen(true)
        console.log('King')
        console.log(bug.id)
    }

    const bugFixed = async (id: string) => {
        await supabase.from('bugs').update({ status: 'in-progress' }).eq('id', id)
    }

    const closerAI = () => {
        setcloseAI(false)
    }


    return (
        <>

            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className="bg-card border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-green-400/50 transition-colors"
            >
                <h3 className="dark:text-white text-zinc-800 font-medium text-sm">{bug.title}</h3>
                <p className="dark:text-gray-400 text-gray-600 text-xs mt-1 line-clamp-2">{bug.description}</p>
                <div className='flex justify-between items-center'>
                    <span className={`text-xs font-semibold mt-2 block ${priorityColors[bug.priority]}`}>
                        {bug.priority.toUpperCase()}
                    </span>

                    {bug.status === 'open' && <button className='text-green-400 underline text-sm hover:text-green-600 cursor-pointer' onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(), viewError(bug) }}>View</button>}
                </div>



            </div>
            {isOpen && <div className='fixed inset-0 flex justify-center items-center bg-black/50 '>
                <div className='bg-card md:h-[83vh] md:w-1/2 h-[60vh] rounded-2xl p-6 flex flex-col gap-4  overflow-y-scroll'>

                    <div className='flex justify-between items-center'>
                        <h1 className='text-green-400 font-mono'>Screenshot</h1>
                        <p className='text-green-400 hover:text cursor-pointer' onClick={() => setIsOpen(false)}>X</p>
                    </div>
                    {bug.img_src ? <div><img src={bug.img_src} alt="no img" className='w-full rounded-lg h-[70vh]' />
                    </div> : <div><p className='text-green-500 font-mono'>No screenshot added</p></div>}

                    <div className='pt-10'>
                        {loading ? <span className='dark:text-white text-black pt-10 font-mono animate-pulse'>AI Suggested Fix...</span> : <span className='dark:text-white pt-10 font-mono'>AI Suggested Fix...</span>}
                        {loading ? <div><span className='animate-pulse'>Looking for the best fix....</span></div> : <div className='border-1 dark:border-green-100 rounded-2xl p-2 flex justify-center items-center flex-col mt-10'>

                            <p className='dark:text-green-300 text-zinc-700 text-sm font-mono'>{analysis}</p>
                        </div>}

                    </div>

                </div></div>}
            {bug.status === 'open' && closeAI && <div className='border-1 border-green-100 rounded-2xl p-2 flex justify-center items-center flex-col'>
                <p className='dark:text-green-300 text-xs font-mono'>{analysis}</p>
                <div className='flex justify-center items-center gap-3 pt-2'>
                    <span className='text-white font-mono text-sm'>Was it helpful?</span>
                    <button className='border-1 border-gray-600 rounded-lg p-2 dark:hover:bg-white hover:bg-green-100 hover:cursor-pointer' onClick={() => bugFixed(bug.id)}><i className="ti ti-check"/></button>
                    <button onClick={closerAI} className='border-1 border-gray-600 rounded-lg p-2 dark:hover:bg-white hover:bg-green-100 hover:cursor-pointer'><i className="ti ti-x"/></button>
                </div>

            </div>}

            {bug.status === 'open' && <div>
                <p className='text-green-500 cursor-pointer hover:text-green-300' onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(), analyze() }}>🤖 AI Bot</p>
            </div>}


        </>
    )
}
