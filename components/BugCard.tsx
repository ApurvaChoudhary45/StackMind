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
    status: string
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
                <span className={`text-xs font-semibold mt-2 block ${priorityColors[bug.priority]}`}>
                    {bug.priority.toUpperCase()}
                </span>
            </div>
            {bug.status === 'open' && <div>
                <p className='text-green-500' onClick={(e)=> {e.stopPropagation(), analyze()}}>🤖 AI Bot</p>
            </div>}

        </>
    )
}
