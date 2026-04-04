'use client'
import React from 'react'

import { useDraggable } from "@dnd-kit/core"

import { CSS } from "@dnd-kit/utilities"

import { useState } from 'react'

type Bug = {
    id: string
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    status: string,
    img_src : string 
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

    const analyze = async () => {
        setloading(true)
        setIsOpen(true)
        try {
            const data = await fetch('/api/ai/summarize-bug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title : bug.title, description: bug.description})
        })
        const res = await data.json()
        console.log(res.analysiss)
        } catch (error) {
            
        }
        
    }

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: bug.id
    })

    const style = {
        transform: CSS.Translate.toString(transform)
    }

    const viewError = (bug : Bug)=>{
        setIsOpen(true)
        console.log('King')
        console.log(bug.id)
    }

    return (
        <>

            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-green-400/50 transition-colors"
            >
                <h3 className="text-white font-medium text-sm">{bug.title}</h3>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{bug.description}</p>
                <div className='flex justify-between items-center'>
                <span className={`text-xs font-semibold mt-2 block ${priorityColors[bug.priority]}`}>
                    {bug.priority.toUpperCase()}
                </span>
                <button className='text-green-400 underline text-sm hover:text-green-600 cursor-pointer' onPointerDown={(e) => e.stopPropagation()} onClick={(e)=>{e.stopPropagation(), viewError(bug)}}>View</button>
                </div>

            </div>
            {isOpen && <div className='fixed inset-0 flex justify-center items-center bg-black/50'>
              <div className='bg-zinc-900 md:h-[83vh] md:w-1/2 h-[60vh] rounded-2xl p-6 flex flex-col gap-4'>
              
              <div className='flex justify-between items-center'>
              <h1 className='text-green-400'>Attached error screenshot</h1>
              <p className='text-green-400 hover:text cursor-pointer' onClick={()=>setIsOpen(false)}>X</p>
                </div>
                {bug.img_src ? <div>
                    <img src={bug.img_src} alt="no img" className='w-full rounded-lg h-[70vh]' />
                </div> : <div><p className='text-green-500'>No screenshot added</p></div>}
                
              </div></div>}
            {bug.status === 'open' && <div>
                <p className='text-green-500' onClick={(e)=> {e.stopPropagation(), analyze()}}>🤖 AI Bot</p>
            </div>}
            

        </>
    )
}
