'use client'
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"

import CreateProject from "./CreateProject"

type Project = {
    name : string,
    description : string,
    id : string
}

export default  function  ProjectCard() {
    const supabase =  createClient()
    const [projects, setProjects] = useState<Project[]>([])
   

    useEffect(() => {
        const fetchData = async ()=>{
            const project  = await supabase.from('projects').select('*').order('created_at', {ascending : false})
            setProjects(project.data ?? [])
        }
        fetchData()
    }, [])

    const deleteProject = async(project : Project)=>{
        // console.log(project.id)
        await supabase.from('projects').delete().eq('id', project.id)
        setProjects(prev=> prev.filter(i=> i.id !== project.id))

    }

    
  return (
    <div>
      {projects?.length === 0 ? <div className='flex justify-center items-center min-h-[60vh] flex-col gap-5'><p className='text-sm text-gray-400'>No projects created yet!</p><CreateProject /></div> : (<div className='md:grid grid-cols-2 gap-10 px-8'>{projects?.map(project => {
                    return (
                        <div key={project?.id} className="border border-green-400/20 rounded-lg p-4 hover:border-green-400  cursor-pointer mt-8 ">
                            
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <h2 className='font-semibold text-green-400'>{project.name}</h2>
                                        <p className='text-gray-400 text-sm'>{project.description}</p>
                                    </div>
                                    <button className='text-red-400 cursor-pointer' onClick={(e)=>{e.stopPropagation(); deleteProject(project)}}>🗑️</button>
                                </div>

                            
                            <div className='flex justify-between items-center mt-10'>
                                <Link href={`/User/dashboard/projects/${project?.id}/notes`}><div className='text-green-400 cursor-pointer hover:text-green-300'>Notes</div></Link>
                                <Link href={`/User/dashboard/projects/${project?.id}/bugs`}><div className='text-green-400 cursor-pointer hover:text-green-300'>Bugs</div></Link>
                                <Link href={`/User/dashboard/projects/${project?.id}/snippets`}> <button className='text-green-400 text-md rounded-xl hover:text-green-300 cursor-pointer'>Snippets Section</button></Link>
                            </div>
                        </div>


                    )
                })}
                </div>
                )}
    </div>
  )
}
