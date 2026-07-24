'use client'
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useMemo } from "react"
import CreateProject from "./CreateProject"
import SignOutOverlay from "./SignOutOverlay"

type Project = {
  name: string,
  description: string,
  id: string
}

export default function ProjectCard() {
  const supabase = useMemo(() => createClient(), [])
  const [projects, setProjects] = useState<Project[]>([])

  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [showCofirm, setshowCofirm] = useState(false)
  const [loading, setloading] = useState(true)



  useEffect(() => {

    const fetchData = async () => {
      setloading(true)
      try {
        const data =  await fetch('/api/getproject')
        const res = await data.json()
        setProjects(res?.projects)
      } catch (error) {
        console.log(error)
      }
      finally {
        setloading(false)
      }

    }
    fetchData()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('projects-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        async () => {
          const { data } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', {
              ascending: false,
            })

          setProjects(data ?? [])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])



  const deleteProject = async () => {
    try {
      setloading(true)
      await fetch('/api/deleteProject', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: projectToDelete?.id })
      })
      setProjects(prev => prev.filter(i => i.id !== projectToDelete?.id))
    } finally {
      setloading(false)
      setshowCofirm(false)
      setProjectToDelete(null)
    }

  }

  const isDeleteOn = async (project: Project) => {
    if (localStorage.getItem('confirmDelete') === 'true') {
      setProjectToDelete(project)
      setshowCofirm(true)
    }
    else {
      setProjectToDelete(project)
      await deleteProject()
    }
  }


  return (
    <div className="px-4 md:px-8">
      {loading ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">
  <div className="flex flex-col items-center gap-5">
    <div className="relative h-16 w-16">
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-zinc-700 border-t-green-400" />
    </div>

    <div className="space-y-1 text-center">
      <h3 className="font-semibold text-white">
        Creating Dashboard...
      </h3>

      <p className="text-sm text-zinc-400">
        Preparing your workspace.
      </p>
    </div>
  </div>
</div>) : projects?.length === 0 ? (<div className="flex min-h-[65vh] flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-green-400/20 bg-card mt-5">
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
        ) : (<div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 mt-5">
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
                      isDeleteOn(project);
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
      {showCofirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-hidden">
          <div className="bg-background border border-zinc-800 rounded-2xl w-full max-w-sm p-6 overflow-y-auto overscroll-contain">

            <div className="w-11 h-11 rounded-xl dark:bg-red-950/40 border border-red-400/20 flex items-center justify-center mb-4">
              <i className="ti ti-trash text-red-400 text-xl" />
            </div>

            <p className="text-sm font-medium text-black dark:text-zinc-200 mb-1.5">Delete this note?</p>
            <p className="text-xs font-mono text-zinc-600 leading-relaxed mb-6">
              This will permanently delete <span className="dark:text-zinc-300 text-black">"{projectToDelete?.name}"</span> and remove it from search. This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setshowCofirm(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-mono font-medium border border-zinc-800 text-zinc-500 hover:text-gray-800 dark:hover:text-zinc-300 hover:border-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteProject}
                disabled={loading}
                className="flex-1 py-2.5 rounded-lg text-sm font-mono font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                {loading ? (
                  <>
                    <i className="ti ti-loader animate-spin text-base" />
                    Deleting
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>

        </div>

      )}
    </div>
  );
}
