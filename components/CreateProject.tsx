'use client'
import React from 'react'
import { useState, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import UpgradeModal from './UpgradeModal'

const CreateProject = () => {
    const router = useRouter()

    const [modal, setmodal] = useState(false)
    const [projectDetails, setprojectDetails] = useState({
        projectName: '',
        projectDescription: '',
    })
    const [loading, setloading] = useState(false)
    const [showUpgrade, setShowUpgrade] = useState<boolean | null>(null)
    const [upgradeReason, setUpgradeReason] = useState('')
    const dialogId = useId()
    const triggerRef = useRef<HTMLButtonElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!modal) return
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !loading && !showUpgrade) {
                setmodal(false)
            }
            if (event.key !== 'Tab' || showUpgrade) return
            const controls = panelRef.current?.querySelectorAll<HTMLElement>(
                'button:not(:disabled), input:not(:disabled), textarea:not(:disabled)'
            )
            if (!controls?.length) return
            const first = controls[0]
            const last = controls[controls.length - 1]
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [modal, loading, showUpgrade])

    useEffect(() => {
        if (!modal) return
        const trigger = triggerRef.current
        return () => trigger?.focus()
    }, [modal])

    const openModal = () => setmodal(true)
    const closeModal = () => {
        if (!loading) setmodal(false)
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setprojectDetails(previous => ({ ...previous, [name]: value }))
    }
    const handleCreate = async () => {
        if (loading || !projectDetails.projectName.trim()) return
        setloading(true)
        try {
            const response = await fetch('/api/new-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: projectDetails.projectName,
                    description: projectDetails.projectDescription,
                }),
            })
            const data = await response.json()
            if (!response.ok) {
                if (data.upgrade) {
                    setUpgradeReason(data.error)
                    setShowUpgrade(true)
                } else {
                    alert(data.error)
                }
                return
            }
            setprojectDetails({ projectName: '', projectDescription: '' })
            setmodal(false)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert('Could not create the project. Please try again.')
        } finally {
            setloading(false)
        }
    }

    return (
        <div>
            <button
                ref={triggerRef}
                onClick={openModal}
                className="inline-flex items-center gap-2 rounded-lg bg-green-400 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-green-300"
            >
                <i className="ti ti-plus" aria-hidden="true" />
                New Project
            </button>

            {modal && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={closeModal}>
                    <div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={dialogId}
                        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-background text-foreground shadow-2xl"
                        onClick={event => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
                            <h2 id={dialogId} className="text-lg font-semibold tracking-tight">New Project</h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
                                aria-label="Close new project dialog"
                                className="flex size-8 items-center justify-center rounded-lg text-text-text-muted transition-colors hover:bg-input hover:text-foreground disabled:opacity-50"
                            >
                                <i className="ti ti-x text-lg" aria-hidden="true" />
                            </button>
                        </div>

                        <form onSubmit={event => { event.preventDefault(); void handleCreate() }}>
                            <div className="space-y-4 px-5 py-5 sm:px-6">
                                <label className="block text-sm font-medium">
                                    Project name
                                    <input
                                        autoFocus
                                        required
                                        disabled={loading}
                                        type="text"
                                        placeholder="e.g. Portfolio website"
                                        value={projectDetails.projectName}
                                        name="projectName"
                                        onChange={handleChange}
                                        className="mt-2 w-full rounded-lg border border-input-border bg-input px-3 py-2.5 text-sm text-input-text placeholder:text-text-text-muted focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                    />
                                </label>

                                <label className="block text-sm font-medium">
                                    Description <span className="font-normal text-text-text-muted">(optional)</span>
                                    <textarea
                                        disabled={loading}
                                        placeholder="What are you working on?"
                                        value={projectDetails.projectDescription}
                                        name="projectDescription"
                                        onChange={handleChange}
                                        rows={3}
                                        className="mt-2 block max-h-60 min-h-24 w-full resize-y rounded-lg border border-input-border bg-input px-3 py-2.5 text-sm leading-6 text-input-text placeholder:text-text-text-muted focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                    />
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-border px-5 py-4 sm:px-6">
                                <button type="button" onClick={closeModal} disabled={loading} className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-input disabled:opacity-50">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !projectDetails.projectName.trim()}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-400 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading && <i className="ti ti-loader animate-spin" aria-hidden="true" />}
                                    {loading ? 'Creating...' : 'Create project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
            {showUpgrade && createPortal(
                <UpgradeModal showUpgrade={showUpgrade} upgradeReason={upgradeReason} setShowUpgrade={setShowUpgrade} />,
                document.body
            )}
        </div>
    )
}

export default CreateProject
