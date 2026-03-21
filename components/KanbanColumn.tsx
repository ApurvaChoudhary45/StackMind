'use client'

import React from 'react'

import { useDroppable } from '@dnd-kit/core'
import BugCard from './BugCard'

type Bug = {
    id: string
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    status: string
}

type Props = {
    id : string,
    title : string,
    bugs : Bug[],
    color : string
}

export default function KanbanColumn({id, title, bugs, color} : Props) {

    const {setNodeRef, isOver} = useDroppable({id})

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 rounded-lg p-4 border transition-colors ${
        isOver ? 'border-green-400 bg-green-400/5' : 'border-zinc-700 bg-zinc-900'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <h2 className="font-semibold text-white">{title}</h2>
        <span className="ml-auto text-gray-400 text-sm">{bugs.length}</span>
      </div>

      {/* Bug Cards */}
      <div className="flex flex-col gap-3 min-h-24">
        {bugs.length === 0 && (
          <p className="text-gray-600 text-sm text-center mt-6">No bugs here</p>
        )}
        {Array.isArray(bugs) && bugs.map(bug => (
          <BugCard key={bug.id} bug={bug} />
        ))}
      </div>
      
    </div>
    
  )
}
