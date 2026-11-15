'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

type Props = {
    userName: string
    userEmail: string
    projectCount: number
    plan : string
    children: React.ReactNode
}

export default function DashboardShell({ userName, userEmail, projectCount, plan, children }: Props) {
    const [collapsed, setCollapsed] = useState(false)

     useEffect(() => {
        if (window.innerWidth < 768) {
            setCollapsed(true)
        }
    }, [])

    return (
        <div className="flex h-dvh overflow-hidden bg-background text-foreground">
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
        plan={plan}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
    />

    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile hamburger button — only shows on mobile */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-background z-20 flex-shrink-0">
            <button
                onClick={() => setCollapsed(false)}
                aria-label="Open sidebar"
                aria-controls="dashboard-sidebar"
                aria-expanded={!collapsed}
                className="flex size-9 items-center justify-center rounded-lg border border-border text-text-text-muted hover:border-green-500/30 hover:text-text-muted transition-colors"
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