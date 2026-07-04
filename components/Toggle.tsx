'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  // Decide which icon to show
  const getIcon = () => {
    if (theme === 'system') return '💻'   // show system icon if selected
    return resolvedTheme === 'dark' ? '🌙' : '☀️'
  }

  return (
    <div className="relative inline-block">
      {/* Icon button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg border border-zinc-700 hover:border-green-400 transition-colors"
      >
        {getIcon()}
      </button>

      {/* Small box ABOVE the icon */}
      {open && (
        <div className="absolute bottom-full mb-2 right-0 bg-background dark:bg-zinc-900 border border-border rounded-md shadow-lg w-32 p-2 z-50">
          <button
            onClick={() => { setTheme('light'); setOpen(false); }}
            className="block w-full text-left px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            Light ☀️
          </button>
          <button
            onClick={() => { setTheme('dark'); setOpen(false); }}
            className="block w-full text-left px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            Dark 🌙
          </button>
          <button
            onClick={() => { setTheme('system'); setOpen(false); }}
            className="block w-full text-left px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            System 💻
          </button>
        </div>
      )}
    </div>
  )
}

export default ThemeToggle
