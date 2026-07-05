'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ThemeToggle from './Toggle'
import LogOut from './LogOut'

type SidebarProps = {
    userName: string
    userEmail: string
    projectCount: number
    collapsed: boolean                          // ← from layout
    setCollapsed: (val: boolean) => void        // ← from layout
}



export default function Sidebar({ userName, userEmail, projectCount, collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const initials = userName.slice(0, 2).toUpperCase()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'ti-layout-dashboard' },
    { href: '/dashboard/notes', label: 'Notes', icon: 'ti-notebook' },
    { href: '/dashboard/bugs', label: 'Bugs', icon: 'ti-bug' },
    { href: '/dashboard/snippets', label: 'Snippets', icon: 'ti-code' },
  ]

  const accountItems = [
    { href: '/dashboard/github', label: 'Github', icon: 'ti-brand-github' },
    { href: '/dashboard/account', label: 'Profile', icon: 'ti-user-circle' },
    { href: '/dashboard/settings', label: 'Settings', icon: 'ti-settings' }, 
  ]

  return (
    <aside className={`
    ${collapsed ? '-translate-x-full md:translate-x-0 md:w-14' : 'w-64'}
    transition-all duration-300
    bg-card border-r border-border
    flex flex-col overflow-hidden flex-shrink-0
    h-screen
    fixed top-0 left-0 md:sticky
    z-40
`}>

      {/* Logo + Toggle */}
      <div className="px-3 py-3 border-b border-border flex items-center justify-between min-h-[52px]">
        <div className="flex items-center gap-2 overflow-hidden">
          {collapsed ? <div className="w-2 h-2 rounded-full bg-green-00 flex-shrink-0" /> : <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />}
          <span className={`font-mono text-green-400 font-medium text-sm whitespace-nowrap transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            StackMind
          </span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 rounded-md border border-border bg-card flex items-center justify-center text-text-muted hover:text-green-400 hover:border-green-400/30 transition-colors flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <i className={`ti ${collapsed ? 'ti-layout-sidebar-left-expand' : 'ti-layout-sidebar-left-collapse'} text-sm`} />
        </button>
      </div>

      {/* User */}
      <div className="px-3 py-3 border-b border-border flex items-center gap-2 overflow-hidden">
        <div className="w-8 h-8 rounded-full bg-card border border-green-400/20 flex items-center justify-center dark: text-green-400 light:text-black font-mono text-xs font-medium flex-shrink-0">
          {initials}
        </div>
        <div className={`overflow-hidden transition-all duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
          <p className="text-xs font-medium text-muted truncate whitespace-nowrap">{userName}</p>
          <p className="text-xs text-text-muted font-mono truncate whitespace-nowrap">{userEmail}</p>
        </div>
      </div>

      {/* Workspace Nav */}
      <div className="px-2 pt-3 pb-1">
        <p className={`text-xs font-medium tracking-widest uppercase text-zinc-700 px-2 mb-2 whitespace-nowrap transition-all duration-200 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
          Workspace
        </p>
        {navItems.map(item => (
          <div key={item.href} className="relative group">
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                pathname === item.href
                  ? 'bg-green-950/60 text-green-400'
                  : 'bg-muted hover:text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              <i className={`ti ${item.icon} text-base flex-shrink-0`} />
              <span className={`whitespace-nowrap transition-all duration-200 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                {item.label}
              </span>
              {item.label === 'Dashboard' && projectCount > 0 && (
                <span className={`ml-auto text-xs font-mono bg-green-400/10 text-green-400 border border-green-400/20 px-1.5 py-0.5 rounded-full whitespace-nowrap transition-all duration-200 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                  {projectCount}
                </span>
              )}
            </Link>
            {/* Tooltip when collapsed */}
            {collapsed && (
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded-md border border-zinc-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="h-px bg-border mx-3 my-1" />

      {/* Account Nav */}
      <div className="px-2 py-1">
        <p className={`text-xs font-medium tracking-widest uppercase text-zinc-700 px-2 mb-2 whitespace-nowrap transition-all duration-200 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
          Account
        </p>
        {accountItems.map(item => (
          <div key={item.href} className="relative group">
            <Link
              href={item.href}
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm bg-muted hover:text-zinc-300 hover:bg-zinc-900 transition-colors mb-0.5"
            >
              <i className={`ti ${item.icon} text-base flex-shrink-0`} />
              <span className={`whitespace-nowrap transition-all duration-200 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                {item.label}
              </span>
            </Link>
            {collapsed && (
              <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-zinc-800 text-zinc-200 text-xs px-2 py-1 rounded-md border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-auto border-t border-border p-2">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm text-muted">
          <i className="ti ti-moon text-base flex-shrink-0" />
          <span className={`whitespace-nowrap transition-all duration-200 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            Dark mode
          </span>
          {!collapsed && (
            <div className="ml-auto">
              <ThemeToggle />   
            </div>
          )}
        </div>
        <div className={`px-2 py-2 rounded-lg text-sm bg-muted hover:text-red-400 hover:bg-red-950/30 transition-colors ${collapsed ? 'justify-center' : ''}`}>
          <LogOut collapsed = {collapsed}/> 
        </div>
      </div>
    </aside>
  )
}