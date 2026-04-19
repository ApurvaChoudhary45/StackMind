'use client'

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

type projectSection = {
  projectId : string,
  userId : string
}


export default function ImportReposButton({projectId, userId}:
  projectSection
) {
  const [repos, setRepos] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [impGithub, setimpGithub] = useState(false)
  const [impFiles, setimpFiles] = useState(false)

  const supabase = createClient()
  const importRepos = async () => {
    setimpGithub(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.getSession()
    console.log(data)
    if (error) {
      console.error("Error fetching session:", error.message)
      return
    }

    if (!data.session) {
      console.error("No active session")
      return
    }

    const token = data.session.provider_token
    if (!token) {
      console.error("No GitHub token found")
      return
    }

    try {
      const res = await fetch("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const reposData = await res.json()
      setRepos(reposData)
      console.log("Imported repos:", reposData)

    } catch (err) {
      console.error("Error fetching repos:", err)
    }
  }

  const getRepoFiles = async (details: any) => {

    setimpFiles(true)
    console.log(details.split('/'))
    let userData = details.split('/')
    let obj = {
      owner: userData[0],
      repo: userData[1]
    }
    const res = await fetch(`https://api.github.com/repos/${obj.owner}/${obj.repo}/contents`)
    const data = await res.json()
    setFiles(data.filter((item: any) => item.type === 'file'))

  }

  const importAsSnippet = async (file: any) => {
    // console.log(file)
    const res = await fetch(file.download_url)
    const data = await res.text()

    const extension = file.name.split('.').pop()
    await supabase.from('snippets').insert({
      title: file.name,
      code: data,
      language: extension,
      project_id: projectId,
      user_id: userId
    })
  }

  return (
    <div>
      <button
        onClick={importRepos}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer"
      >
        Import Github Repo
      </button>

      {impGithub && <div className="fixed inset-0 flex justify-center items-center bg-black/70">
        <div className="h-1/2 w-[70vw] rounded-2xl bg-black/90 overflow-x-auto">
          <div className="flex justify-between items-center px-7 pt-7">
            <h1 className="text-green-400">Import a Folder</h1>
            <p className="text-white hover:text-green-400 cursor-pointer" onClick={() => setimpGithub(false)}>X</p>
          </div>
          <div className="grid grid-cols-2 gap-6 px-7 pt-7 ">
            {Array.isArray(repos) && repos.map(item => (
              <div className="" key={item.id}>
                <div className=" border border-1 border-green-400 px-2 py-2 rounded-2xl flex justify-between">
                  <p className="text-white">{item.full_name}</p>
                  <p className="text-green-500 font-extrabold text-sm hover:text-green-600 cursor-pointer" onClick={() => getRepoFiles(item.full_name)}>Import</p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>}

      {impFiles && <div className="fixed inset-0 flex justify-center items-center bg-black/70">
        <div className="h-1/2 w-[70vw] rounded-2xl bg-black/90 overflow-x-auto">
          {files.length > 0 && (
            <div className="mt-4 px-7">
              <div className="flex justify-between items-center" onClick={() => setimpFiles(false)}>
                <p className="text-gray-400 text-xs font-mono mb-3">// select a file to import as snippet</p>
                <p className="text-green-400">X</p>
              </div>
              {files.map((file: any) => (
                <div key={file.name} className="flex justify-between items-center border border-zinc-800 rounded-lg px-3 py-2 mb-2 hover:border-green-400/50">
                  <p className="text-white text-sm font-mono">{file.name}</p>
                  <button
                    onClick={() => importAsSnippet(file)}
                    className="text-xs text-green-400 hover:text-green-300"
                  >
                    Import →
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>}
    </div>
  )
}