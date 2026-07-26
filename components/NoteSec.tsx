'use client'

import { useState } from 'react'

// pinned locale + timezone so the server-rendered string and the
// client-rendered string are always identical (avoids hydration mismatch
// caused by server/browser having different default locale/timezone)
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })

export default function NotesGrid({ notes }: { notes: any[] }) {
  const [showAll, setShowAll] = useState(false)
  // tracks which note cards have their content expanded, keyed by note.id
  const [expandedIds, setExpandedIds] = useState<Set<string | number>>(new Set())

  const toggleExpanded = (id: string | number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const displayedNotes = showAll ? notes : notes.slice(0, 6)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayedNotes.map((note) => {
          const isExpanded = expandedIds.has(note.id)

          return (
          <div
            key={note.id}
            className="bg-card border border-border hover:border-green-400/20 rounded-xl p-4 transition-colors cursor-pointer"
          >
            <p className="font-mono text-xs dark:text-white mb-1">
              {(note.projects as any)?.name}
            </p>

            <h3 className="text-sm font-medium text-text-muted mb-1">
              {note.title}
            </h3>

            {/* suppressHydrationWarning: note.content is raw HTML from a rich
                text editor — the browser's HTML parser can normalize it
                slightly differently than the server-rendered string (unclosed
                tags, whitespace, entity encoding, etc.), which React would
                otherwise flag as a hydration mismatch even though the
                rendered content is effectively the same. */}
            <div
              className={`text-xs dark:text-zinc-400 mb-1 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: note.content }}
            />

            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(note.id)
              }}
              className="text-xs font-mono text-green-400 hover:text-green-300 mb-3 transition-colors"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>

            <div className="flex justify-between items-center">
              <div className="flex gap-1 flex-wrap">
                {note.tags?.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs font-mono dark:text-green-400 text-green-700 bg-background border border-green-400/10 px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              
            </div>
            <span className="text-xs font-mono text-zinc-700">
                {formatDate(note.created_at)}
              </span>
          </div>
          )
        })}
      </div>

      {notes.length > 6 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="rounded-lg border border-green-400/20 bg-card px-5 py-2 text-sm font-medium text-green-400 transition-colors hover:border-green-400 hover:bg-green-500/10"
          >
            {showAll ? "Show Less" : `Show ${notes.length - 6} More`}
          </button>
        </div>
      )}
    </>
  )
}