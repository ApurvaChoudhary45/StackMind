'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const DarkMode = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const getIcon = () => {
    if (theme === 'system') return <span className='dark:text-white text-black  text-xl'><i className="ti ti-device-desktop"/></span>
    return resolvedTheme === 'dark' ? <span className='text-xl'> <i className="ti ti-moon"/> </span>: <span className='dark:text-white text-black text-xl'><i className="ti ti-sun"/></span>
  }

  return (
    <div className="relative inline-block">
      {/* Icon button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg  hover:border-green-400 transition-colors"
      >
        {getIcon()}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg w-32 p-2 z-50">
          <button
            onClick={() => { setTheme('light'); setOpen(false); }}
            className="block w-full text-left px-2 py-1 rounded dark:text-white text-black hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            Light <i className="ti ti-sun"/>
          </button>
          <button
            onClick={() => { setTheme('dark'); setOpen(false); }}
            className="block w-full text-left px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:text-white text-black"
          >
            Dark <i className="ti ti-moon"/>
          </button>
          <button
            onClick={() => { setTheme('system'); setOpen(false); }}
            className="block w-full text-left px-2 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:text-white text-black"
          >
            System <i className="ti ti-device-desktop"/>
          </button>
        </div>
      )}
    </div>
  )
}

export default DarkMode
