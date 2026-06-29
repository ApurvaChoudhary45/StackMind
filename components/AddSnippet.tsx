'use client'
import Link from 'next/link'
import React, { useState } from 'react'

type Project = {
    id: string
    name: string
    created_at: string
    
}

const AddSnippet = () => {
    const [modal, setModal] = useState(false)

    const [loading, setloading] = useState(false)

    const [userNotes, setuserNotes] = useState<Project[]>([]);
    const openModal = () => {
        setModal(true)
    }

    const getProjects = async () => {
        try {
            setloading(true)
            const data = await fetch('/api/newnote')
            const res = await data.json()
            setuserNotes(res?.projects)
        } catch (error) {
            console.log(error)
        }
        finally {
            setloading(false)
        }
    }

    return (
        <div>
            {/* Modal Button */}

            <button className="flex items-center gap-2 bg-green-400 text-black text-sm font-semibold px-4 py-2 rounded-lg" onClick={() => { openModal(), getProjects() }}>
                + Add Snippet
            </button>
            {modal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/80 backdrop-blur-sm z-50 p-4" onClick={(e) => setModal(false)}>
                    <div className="w-full max-w-2xl bg-zinc-950 rounded-xl border border-zinc-800 overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
                            <div>
                                <h2 className="text-sm font-medium text-zinc-200 font-mono">Select a Project</h2>
                                <p className="text-xs text-zinc-600 font-mono mt-0.5">Notes belong to a project — pick one to continue</p>
                            </div>
                        </div>

                        {/* Project Grid */}
                        {loading ? (
                            // Loading state
                            <div className="flex items-center justify-center py-10">
                                <i className="ti ti-loader animate-spin text-green-400 text-xl" />
                            </div>
                        ) : userNotes?.length === 0 ? (
                            // Empty state
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <i className="ti ti-folder-off text-zinc-700 text-2xl" />
                                <p className="text-xs font-mono text-zinc-600">No projects yet</p>
                            </div>
                        ) : (
                            // Data
                            <div className="p-5 max-h-[50vh] overflow-y-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {userNotes?.map(project => (
                                        <div
                                            key={project.id}
                                            // onClick={() => handleProjectSelect(project)}
                                            className="group flex flex-col gap-2 bg-zinc-900 border border-zinc-800 hover:border-green-400/30 hover:bg-zinc-900/80 rounded-xl p-4 cursor-pointer transition-all"
                                        >
                                            {/* Project Icon + Name */}
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-green-950/60 border border-green-400/20 flex items-center justify-center flex-shrink-0">
                                                    <i className="ti ti-folder-filled text-green-400 text-sm" />
                                                </div>
                                                <span className="text-sm font-medium text-zinc-200 font-mono truncate group-hover:text-white transition-colors">
                                    {project.name}
                                </span>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs font-mono text-zinc-600">
                                                    {new Date(project.created_at).toLocaleDateString()}
                                                </span>
                                                <Link href={`/dashboard/projects/${project?.id}/snippets`}><span className="text-xs font-mono text-green-400 bg-green-950/50 border border-green-400/10 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Select →
                                                </span></Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        )}

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-zinc-900 flex items-center justify-between">
                            <p className="text-xs font-mono text-zinc-600">
                    // or <Link href={`/dashboard`}><span className="text-green-400 cursor-pointer hover:underline">create a new project</span></Link>
                            </p>
                            <button
                                onClick={() => setModal(false)}
                                className="text-xs font-mono text-zinc-600 border border-zinc-800 px-3 py-1.5 rounded-lg hover:text-zinc-300 hover:border-zinc-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

export default AddSnippet
