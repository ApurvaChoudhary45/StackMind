'use client'

import { useEffect } from 'react'

export default function NotesError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="p-8 bg-black/90 min-h-screen flex flex-col items-center justify-center">
      <p className="font-mono text-red-400 text-sm mb-2">// something went wrong</p>
      <h2 className="text-white text-xl font-bold mb-4">Failed to load notes</h2>
      <p className="text-gray-500 text-sm mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-green-400 text-black font-mono font-bold rounded hover:opacity-80"
      >
        Try again
      </button>
    </div>
  )
}