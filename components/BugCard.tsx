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
            {isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div className="bg-card border border-green-400/20 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-green-400 font-mono flex items-center gap-2">
            <i className="ti ti-sparkles" />
            AI Bug Analysis
          </h1>
          <p className="text-sm text-muted mt-1">
            AI-generated analysis and suggested solution for this issue.
          </p>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="w-9 h-9 rounded-lg border border-border hover:border-red-400 hover:text-red-400 transition-colors flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto max-h-[70vh]">

        {loading ? (
          <div className="border border-green-400/20 rounded-2xl bg-green-400/5 p-8 flex flex-col items-center justify-center gap-4">
            <i className="ti ti-loader animate-spin text-4xl text-green-400" />

            <div className="text-center">
              <h2 className="font-semibold text-green-400 font-mono">
                Analyzing Bug...
              </h2>

              <p className="text-sm text-muted mt-2 animate-pulse">
                Looking for the best possible solution.
              </p>
            </div>
          </div>
        ) : (
          <div className="border border-green-400/20 bg-green-400/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="uppercase tracking-widest text-xs text-green-400 font-semibold">
                Suggested Fix
              </span>
            </div>

            <p className="whitespace-pre-wrap leading-8 text-[15px] font-mono dark:text-green-200 text-zinc-700">
              {analysis}
            </p>
          </div>
        )}

      </div>
    </div>
  </div>
)}
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
