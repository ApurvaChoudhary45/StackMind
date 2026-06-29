'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'

type Props = {
    userName: string
    userEmail: string
    projectCount: number
    children: React.ReactNode
}

export default function DashboardShell({ userName, userEmail, projectCount, children }: Props) {
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="flex min-h-screen bg-black">
    {/* Mobile backdrop */}
    {!collapsed && (
        <div
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setCollapsed(true)}
        />
    )}

    <Sidebar
        userName={userName}
        userEmail={userEmail}
        projectCount={projectCount}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
    />

    <main className="flex-1 overflow-auto">
        {/* Mobile hamburger button — only shows on mobile */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-900 sticky top-0 bg-black z-20">
            <button
                onClick={() => setCollapsed(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 hover:text-green-400 hover:border-green-400/30 transition-colors"
            >
                <i className="ti ti-layout-sidebar-left-expand text-base" />
            </button>
            <span className="font-mono text-green-400 text-sm font-medium">StackMind</span>
        </div>

        {children}
    </main>
</div>
    )
}