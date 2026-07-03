'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CreateProject = () => {
    const supabase = createClient()
    const router = useRouter()

    const [modal, setmodal] = useState(false)
    const [projectDetails, setprojectDetails] = useState({
        projectName: '',
        projectDescription: '',
    })
    const [loading, setloading] = useState(false)
    const openModal = () => {
        setmodal(true)
    }

    const closeModal = () => {
        setmodal(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setprojectDetails(prev => ({ ...prev, [name]: value }))
    }

    const handleCreate = async () => {
        setloading(true)
        const { data: { user } } = await supabase.auth.getUser()

        await supabase.from('projects').insert({
            name: projectDetails?.projectName,
            description: projectDetails?.projectDescription,
            user_id: user?.id
        })
        setprojectDetails({ projectName: '', projectDescription: '' })
        setloading(false)
        setmodal(false)
        router.refresh()    

    }
    return (
        <div className='pt-8'>
            <button onClick={openModal} className='p-2 text-sm bg-button text-muted rounded-2xl hover:bg-button-hover'>+ New Project</button>

            {modal && <div className='fixed inset-0 flex justify-center items-center bg-black/70' onClick={closeModal}>
                <div className='h-80 w-100 bg-background rounded-2xl p-6' onClick={(e)=>e.stopPropagation()}>
                    <h2 className="text-xl font-bold text-green-400 mb-4">New Project</h2>

                    <input
                        type="text"
                        placeholder="Project name"
                        value={projectDetails.projectName}
                        name='projectName'
                        onChange={handleChange}
                        className="w-full bg-input border border-border text-input-text rounded p-2 mb-3 focus:outline-none focus:border-green-400"
                    />

                    <textarea
                        placeholder="Description (optional)"
                        value={projectDetails.projectDescription}
                        name='projectDescription'
                        onChange={handleChange}
                        className="w-full bg-input border border-border text-input-text rounded p-2 mb-4 focus:outline-none focus:border-green-400 resize-none h-24"
                    />

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={closeModal}

                            className="px-4 py-2 text-muted hover:text-black dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={loading}
                            className="px-4 py-2 bg-green-400 text-black font-semibold rounded hover:bg-green-300 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>

                </div>


            </div>}
        </div>


    )
}

export default CreateProject
