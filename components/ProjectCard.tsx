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
  <div className="px-4 md:px-8">
    {projects?.length === 0 ? (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-green-400/20 bg-card mt-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
          <i className="ti ti-folder-plus text-4xl text-green-400" />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">No Projects Yet</h2>
          <p className="text-muted">
            Create your first project and start organizing your development
            workflow.
          </p>
        </div>

        <CreateProject />
      </div>
    ) : (
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {projects?.map((project) => {
          return (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl border border-green-500/15 bg-card/80 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:border-green-400/40 hover:shadow-[0_10px_35px_rgba(34,197,94,0.08)]"
            >
              {/* Glow */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-500/10 blur-3xl" />
              </div>

              {/* Top Accent */}
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-green-500 via-emerald-400 to-transparent" />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
                        <i className="ti ti-folder text-xl text-green-400" />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-green-500 dark:text-green-400">
                          {project.name}
                        </h2>

                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project);
                    }}
                    className="rounded-lg p-2 text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-500"
                  >
                    <i className="ti ti-trash text-lg" />
                  </button>
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-border" />

                {/* Actions */}
                <div className="grid grid-cols-3 gap-3">
                  <Link href={`/dashboard/projects/${project.id}/notes`}>
                    <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background/40 py-4 transition-all hover:border-green-400/40 hover:bg-green-500/5">
                      <i className="ti ti-notebook text-xl text-green-400" />
                      <span className="text-sm font-medium">Notes</span>
                    </div>
                  </Link>

                  <Link href={`/dashboard/projects/${project.id}/bugs`}>
                    <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background/40 py-4 transition-all hover:border-green-400/40 hover:bg-green-500/5">
                      <i className="ti ti-bug text-xl text-green-400" />
                      <span className="text-sm font-medium">Bugs</span>
                    </div>
                  </Link>

                  <Link href={`/dashboard/projects/${project.id}/snippets`}>
                    <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background/40 py-4 transition-all hover:border-green-400/40 hover:bg-green-500/5">
                      <i className="ti ti-code text-xl text-green-400" />
                      <span className="text-sm font-medium">Snippets</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
}
