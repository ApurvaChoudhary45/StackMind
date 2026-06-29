"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { button, data, div } from "framer-motion/client";

const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Dockerfile: "#384d54",
  CSS: "#563d7c",
  HTML: "#e34c26",
};

type repo = {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
  updated_at: string;
  owner: {
    login: string
  },
};

type content = {
  path: string,
  name: string,
  type: string
}

type repoContent = {
  owner: {
    login: string
  },
  name: string
}

type projectSection = {
  projectId: string,
  userId: string
}


const ConnectGit = ({ projectId, userId }: projectSection) => {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<repo[]>([]);
  const [contents, setContents] = useState<content[]>([])
  const [search, setSearch] = useState("");

  const [openRepo, setopenRepo] = useState(false)

  const [tokenExpired, setTokenExpired] = useState(false)

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    const checkToken = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: tokenData } = await supabase
        .from('github_tokens')
        .select('token')
        .eq('user_id', user?.id)
        .single()

      if (tokenData?.token) {
        // Token exists — fetch repos automatically
        getGithub()
      }
    }
    checkToken()
  }, [])

  const getGithub = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: tokenData } = await supabase
        .from('github_tokens')
        .select('token')
        .eq('user_id', user?.id)
        .single()

      if (!tokenData?.token) {
        console.error('No GitHub token found')
        return
      }


      const res = await fetch('https://api.github.com/user/repos?per_page=100', {
        headers: {
          Authorization: `Bearer ${tokenData.token}`
        }
      })

      if (res.status === 401) {
        // Token expired — delete it from DB and ask user to reconnect
        await supabase.from('github_tokens').delete().eq('user_id', user?.id)
        setTokenExpired(true)
        setRepos([])
        return
      }

      const data = await res.json();
      console.log(data)
      setRepos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const getContent = async (repo: repoContent) => {
    setopenRepo(true)
    try {
      setLoading(true)

      const getData = await fetch(`https://api.github.com/repos/${repo?.owner?.login}/${repo.name}/contents/`)

      const res = await getData.json()
      console.log(res)
      setContents(res)
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }

  }

  const closeRepo = () => {
    setopenRepo(false)
  }

  const importAsSnippet = async (file: any) => {
    setStatus('loading')
    try {
      const res = await fetch(file.download_url)
      const data = await res.text()
      console.log(data)
      const extension = file.name.split('.').pop()

      await supabase.from('snippets').insert({
        title: file.name,
        code: data,
        language: extension,
        project_id: projectId,
        user_id: userId
      });

      setStatus('success')
      setTimeout(() => setStatus("idle"), 2000);  
    } catch (error) {
      console.log(error)  
      setStatus('idle')
    }

  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-green-400">
      {repos.length === 0 ? (
        loading ? (
          <>
            <h1 className="text-lg font-mono mb-8">Connect Your GitHub</h1>
            <button className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm animate-pulse">
              <i className="ti ti-brand-github px-2"></i>
              Connecting...
            </button>
            <p className="mt-4 text-sm text-gray-500">
              // You can import snippets from your GitHub repo //
            </p>
          </>
        ) : (
          <>
            {!tokenExpired && <><h1 className="text-lg font-mono mb-8">Connect Your GitHub</h1>
              <button
                className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm"
                onClick={getGithub}
              >
                <i className="ti ti-brand-github px-2"></i>
                Connect GitHub
              </button>
              <p className="mt-4 text-sm text-gray-500">
              // You can import snippets from your GitHub repo //
              </p></>}
          </>
        )
      ) : (
        <div className="p-6 bg-black/90 min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <p className="font-mono text-sm text-zinc-600">
              // <span className="text-green-400">your repos</span> —{" "}
              {repos.length} total
            </p>
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2">
              <i className="ti ti-search text-zinc-600 text-sm" />
              <input
                type="text"
                placeholder="Search repos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-mono text-zinc-300 placeholder:text-zinc-700 w-48"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-zinc-950 border border-zinc-900 rounded-xl h-44"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {repos?.filter((i: repo) =>
                i.name.toLowerCase().includes(search.toLowerCase())
              )
                .map((repo: repo) => (
                  <div
                    key={repo.id}
                    className="bg-zinc-950 border border-zinc-900 hover:border-green-400/20 rounded-xl p-5 flex flex-col gap-3 transition-colors"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <i className="ti ti-brand-github text-green-400 text-base" />
                        <span className="text-sm font-medium text-zinc-200 font-mono">
                          {repo.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded-full border ${repo.private
                          ? "text-zinc-500 bg-zinc-900 border-zinc-800"
                          : "text-green-400 bg-green-950/50 border-green-400/20"
                          }`}
                      >
                        {repo.private ? "private" : "public"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                      {repo.description ?? "No description provided"}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4">
                      {repo.language && (
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                          <div

                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{
                              background: langColors[repo.language] ?? "#888",
                            }}
                          />
                          {repo.language}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-zinc-600 font-mono">
                        <i className="ti ti-star text-sm" />
                        {repo.stargazers_count}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-600 font-mono">
                        <i className="ti ti-git-fork text-sm" />
                        {repo.forks_count}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-2 border-t border-zinc-900">
                      <span className="text-xs font-mono text-zinc-700">
                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                      <button className="flex items-center gap-1.5 text-xs font-mono font-medium bg-green-400 text-black px-3 py-1.5 rounded-lg hover:bg-green-300 transition-colors" onClick={() => getContent(repo)}>
                        <i className="ti ti-file-import text-sm" />
                        Import
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
      {openRepo && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-black border border-green-400/30 rounded-xl shadow-lg w-full max-w-2xl p-6 text-green-400 font-mono">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <i className="ti ti-brand-github text-green-400 text-lg" />
              {/* <h2 className="text-base font-bold">Repo: <span className="text-white">{ }</span></h2> */}
              <span className="text-xs font-mono text-green-400 bg-green-950/50 border border-green-400/20 px-2 py-0.5 rounded-full">
                {contents.length} files
              </span>
            </div>
            <button
              onClick={closeRepo}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-400/30 transition-colors"
            >
              <i className="ti ti-x text-sm" />
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 mb-4">
            <i className="ti ti-search text-zinc-600 text-sm" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-mono text-zinc-300 placeholder:text-zinc-700 w-full"
            />
          </div>

          {/* File List */}
          <div className="max-h-[60vh] overflow-y-auto space-y-1.5 pr-1">
            {contents
              .map((file) => (
                <div
                  key={file.path}
                  className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 hover:border-green-400/30 transition-colors group"
                >
                  {/* Left — icon + name */}
                  <div className="flex items-center gap-2">
                    <i className={`ti ${file.type === 'dir' ? 'ti-folder-filled text-amber-400' : 'ti-file text-zinc-500 group-hover:text-green-400'} text-sm transition-colors`} />
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                      {file.name}
                    </span>
                  </div>

                  {/* Right — type badge + import button */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full border border-green-400/20 bg-green-950/30 text-green-400">
                      {file.type === 'dir' ? 'folder' : file.name.split('.').pop()}
                    </span>
                    {file.type === 'file' && (
                      <button
                        onClick={() => importAsSnippet(file)}
                        className="text-xs font-mono font-medium bg-green-400 text-black px-3 py-1 rounded-lg hover:bg-green-300 transition-colors opacity-0 group-hover:opacity-100"
                      >
                       {status === 'loading' ? (<i className={`ti ti-loader animate-spin text-black text-base`} />) : status === 'success' ? (<span className="bg-green-400"><i className={`ti ti-check text-black text-base`} /></span>) : (<span>Import</span>)}
                      </button> 
                    )}
                    {file.type === 'dir' && (
                      <button
                        // onClick={() => onFolderClick(file.path)}
                        className="text-xs font-mono text-zinc-500 border border-zinc-800 px-3 py-1 rounded-lg hover:text-zinc-300 hover:border-zinc-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Open
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-between items-center pt-4 border-t border-zinc-900">
            <p className="text-xs text-zinc-600">
        // hover a file to <span className="text-green-400">import</span>
            </p>
            <button
              onClick={closeRepo}
              className="text-sm font-medium bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>}
      {tokenExpired && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-zinc-500 font-mono text-sm">
            // GitHub token expired — logut and login to continue
          </p>
          <button
            onClick={getGithub}
            className="flex items-center gap-2 bg-green-400 text-black px-5 py-2.5 rounded-lg font-mono font-semibold text-sm hover:bg-green-300 transition-colors"
          >
            <i className="ti ti-brand-github" />
            Reconnect GitHub
          </button>
        </div>
      )}
    </main>

  );
};

export default ConnectGit;
