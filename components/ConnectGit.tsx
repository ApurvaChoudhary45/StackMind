"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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


const getLanguage = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase()

    switch (ext) {
        case "ts":
            return "typescript"

        case "tsx":
            return "tsx"

        case "js":
            return "javascript"

        case "jsx":
            return "jsx"

        case "json":
            return "json"

        case "css":
            return "css"

        case "scss":
            return "scss"

        case "html":
            return "html"

        case "md":
            return "markdown"

        case "py":
            return "python"

        case "go":
            return "go"

        case "java":
            return "java"

        case "c":
            return "c"

        case "cpp":
            return "cpp"

        case "sql":
            return "sql"

        case "yml":
        case "yaml":
            return "yaml"

        case "sh":
            return "bash"

        case "dockerfile":
            return "docker"

        default:
            return "text"
    }
}
const ConnectGit = ({ projectId, userId }: projectSection) => {
  const supabase = createClient();
  const [hasGithubConnected, setHasGithubConnected] = useState(false)
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<repo[]>([]);
  const [contents, setContents] = useState<content[]>([])
  const [search, setSearch] = useState("");
  const [repoSearch, setRepoSearch] = useState("");

  const [openRepo, setopenRepo] = useState(false)

  const [tokenExpired, setTokenExpired] = useState(false)

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const [selectedRepo, setSelectedRepo] = useState<repoContent | null>(null)

  // separate from `loading` (used for repo/file fetches) — tracks the initial
  // "does this user even have a github token" check
  const [checkingToken, setCheckingToken] = useState(true);

  const [currentPath, setCurrentPath] = useState("")
  const [breadcrumb, setBreadcrumb] = useState<string[]>([])
  const [loadingFolder, setLoadingFolder] = useState(false)

  const [previewOpen, setPreviewOpen] = useState(false)

  const [previewLoading, setPreviewLoading] = useState(false)

  const [previewFile, setPreviewFile] = useState<any>(null)

  const [previewContent, setPreviewContent] = useState("")

  const [copied, setCopied] = useState(false)


  // keeps a live reference to hasGithubConnected so the `focus` listener
  // (registered once on mount) never reads a stale value
  const hasGithubConnectedRef = useRef(hasGithubConnected);
  useEffect(() => {
    hasGithubConnectedRef.current = hasGithubConnected;
  }, [hasGithubConnected]);

  const checkToken = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const providers = user?.app_metadata?.providers ?? []

    const hasGithub = providers.includes("github")

    setHasGithubConnected(hasGithub)

    if (!hasGithub) return

    const { data: tokenData } = await supabase
      .from("github_tokens")
      .select("token")
      .eq("user_id", user?.id)
      .single()

    if (tokenData?.token) {
      getGithub()
    }
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(previewContent)

    setCopied(true)

    setTimeout(() => {
        setCopied(false)
    }, 2000)
}
useEffect(() => {
    setCopied(false);
}, [previewFile]);

  useEffect(() => {
    const runInitialCheck = async () => {
      setCheckingToken(true)
      await checkToken()
      setCheckingToken(false)
    }
    runInitialCheck()

    // If the user connects GitHub from Settings → Connected Accounts and
    // comes back to this tab, re-check the token and auto-fetch repos
    // instead of leaving them stuck on the "not connected" screen.
    const onFocus = () => {
      if (!hasGithubConnectedRef.current) {
        checkToken()
      }
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
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
        console.error("No GitHub token found")
        setTokenExpired(true)
        return
      }

      const res = await fetch('https://api.github.com/user/repos?per_page=100', {
        headers: {
          Authorization: `Bearer ${tokenData.token}`
        }
      })

      // Any non-OK response (401 expired, 403 revoked/rate-limited, etc.)
      // means the stored token is unusable — treat it the same way.
      if (!res.ok) {
        await supabase
          .from("github_tokens")
          .delete()
          .eq("user_id", user?.id)

        setTokenExpired(true)
        setRepos([])
        return
      }

      const data = await res.json();

      // Guard against GitHub returning a non-array error object even on
      // a 200-ish response, so we never render the connected view with junk data.
      if (!Array.isArray(data)) {
        console.error('Unexpected GitHub response', data)
        setHasGithubConnected(false)
        setRepos([])
        return
      }

      setRepos(data);
    } catch (error) {
      console.error(error)
      setRepos([])
    } finally {
      setLoading(false);
    }
  };

  const getContent = async (repo: repoContent, path: string = "") => {
    setSelectedRepo(repo)
    setopenRepo(true)
    try {
      setLoadingFolder(true)

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
        setContents([])
        return
      }

      const getData = await fetch(
        `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/${path}`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`
          }
        }
      )

      if (getData.status === 401) {
        await supabase.from('github_tokens').delete().eq('user_id', user?.id)
        setTokenExpired(true)
        setContents([])
        setopenRepo(false)
        return
      }

      if (!getData.ok) {
        console.error('Failed to fetch repo contents', getData.status)
        setContents([])
        return
      }

      const res = await getData.json()
      console.log(res)
      setCurrentPath(path)
      console.log(currentPath)

      setBreadcrumb(
        path === ""
          ? []
          : path.split("/")
      )

      const sorted = [...res].sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name)
        }

        return a.type === "dir" ? -1 : 1
      })

      setContents(sorted)
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoadingFolder(false)
    }
  }

  const closeRepo = () => {
    setopenRepo(false)
  }

  const importAsSnippet = async () => {
    if (!previewFile) return

    setStatus("loading")

    try {
      const extension = previewFile.name.split(".").pop()

      await supabase.from("snippets").insert({
        title: previewFile.name,
        code: previewContent,
        language: extension,
        project_id: projectId,
        user_id: userId,
      })

      setStatus("success")

      setTimeout(() => {
        setStatus("idle")
        setPreviewOpen(false)
      }, 1200)
    } catch (err) {
      console.log(err)
      setStatus("idle")
    }
  }

  const previewSnippet = async (file: any) => {
    try {
      setPreviewOpen(true)
      setPreviewLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data: tokenData } = await supabase
        .from("github_tokens")
        .select("token")
        .eq("user_id", user?.id)
        .single()

      const res = await fetch(file.url, {
        headers: tokenData?.token
          ? {
            Authorization: `Bearer ${tokenData.token}`,
          }
          : {},
      })

      const text = await res.text()

      setPreviewFile(file)
      setPreviewContent(text)
      
    } catch (err) {
      console.log(err)
    } finally {
      setPreviewLoading(false)
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-text-muted">
      {checkingToken || (hasGithubConnected && loading) ? (
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
      ) : !hasGithubConnected && !tokenExpired ? (
        <>
          {!tokenExpired && (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <i className="ti ti-brand-github text-3xl text-green-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">GitHub Not Connected</h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  You signed in using Google. To import repositories,
                  connect your GitHub account from
                  <span className="font-semibold text-green-400">
                    {" "}Settings → Connected Accounts
                  </span>.
                  Once connected, your repositories will appear here automatically.
                </p>
              </div>
              <button
                disabled
                className="cursor-not-allowed rounded-lg bg-green-500/20 px-6 py-3 text-sm font-semibold text-green-300 opacity-70"
              >
                GitHub Required
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="p-6 bg-background h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <p className="font-mono text-sm text-zinc-600">
              // <span className="text-text-muted">your repos</span> —{" "}
              {repos.length} total
            </p>
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">

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
                  className="bg-card border border-border rounded-xl h-44"
                />
              ))}
            </div>
          ) : (
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {repos?.filter((i: repo) =>
                  i.name.toLowerCase().includes(search.toLowerCase())
                )
                  .map((repo: repo) => (
                    <div
                      key={repo.id}
                      className="bg-card border border-border hover:border-green-400/20 rounded-xl p-5 flex flex-col gap-3 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <i className="ti ti-brand-github text-text-muted text-base" />
                          <span className="text-sm font-medium text-text-muted font-mono">
                            {repo.name}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded-full border ${repo.private
                            ? "text-muted bg-card border-zinc-800"
                            : "text-text-muted bg-background border-green-400/20"
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
                      <div className="flex justify-between items-center pt-2 border-t border-border">
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
            </div>
          )}
        </div>
      )}
      
      {openRepo && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-2">
        <div className="bg-background border border-green-400/30 rounded-xl shadow-lg w-full max-w-5xl p-6 text-text-muted font-mono">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-wrap">

                <span
                  onClick={() => getContent(selectedRepo!, "")}
                  className="cursor-pointer text-green-400"
                >
                  {selectedRepo?.name}
                </span>

                {breadcrumb.map((folder, index) => {

                  const path = breadcrumb
                    .slice(0, index + 1)
                    .join("/")

                  return (
                    <React.Fragment key={path}>

                      <i className="ti ti-chevron-right text-xs text-zinc-600" />

                      <span
                        onClick={() => getContent(selectedRepo!, path)}
                        className="cursor-pointer hover:text-white"
                      >
                        {folder}
                      </span>

                    </React.Fragment>
                  )
                })}
              </div>
              {/* <h2 className="text-base font-bold">Repo: <span className="text-white">{ }</span></h2> */}
              <span className="text-xs font-mono text-text-muted bg-card border border-green-400/20 px-2 py-0.5 rounded-full">
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

          {currentPath && (
            <button
              onClick={() => {
                const parent = currentPath
                  .split("/")
                  .slice(0, -1)
                  .join("/")

                getContent(selectedRepo!, parent)
              }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:border-green-400/30"
            >
              <i className="ti ti-arrow-left" />
              Back
            </button>
          )}

          {/* Search */}
          <div className="flex items-center gap-2 bg-card border border-zinc-800 rounded-lg px-3 py-2 mb-4">
            <i className="ti ti-search text-zinc-600 text-sm" />
            <input
              type="text"
              placeholder="Search files..."
              value={repoSearch}
              onChange={e => setRepoSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-mono text-text-muted placeholder:text-zinc-700 w-full"
            />
          </div>

          {/* File List */}
          <div className="max-h-[60vh] overflow-y-auto space-y-1.5 pr-1">
            {loadingFolder ? (
              <div className="space-y-2 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-12 rounded-lg border border-border bg-card"
                  />
                ))}
              </div>
            ) : contents.filter(i =>
      i.name.toLowerCase().includes(repoSearch.toLowerCase())
    ).length === 0 ? (
    <div className="py-20 text-center">
      <i className="ti ti-folder-off text-5xl text-zinc-700" />

      <p className="mt-3 text-zinc-500">
        {repoSearch
          ? "No files match your search"
          : "This folder is empty"}
      </p>
    </div>
  ) : contents.filter(i => i.name.toLocaleLowerCase().includes(repoSearch.toLocaleLowerCase()))
              .map((file) => (
                <div
                  key={file.path}
                  className="flex justify-between items-center bg-card border border-zinc-800 rounded-lg px-3 py-2.5 hover:border-green-400/30 transition-colors group"
                >
                  {/* Left — icon + name */}
                  <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                    <i className={`ti ${file.type === 'dir' ? 'ti-folder-filled text-amber-400' : 'ti-file text-zinc-500 group-hover:text-text-muted'} text-sm transition-colors`} />
                    <span className="text-sm text-zinc-600 group-hover:text-black dark:text-zinc-300 dark:group-hover:text-white transition-colors">
                      {file.name}
                    </span>
                  </div>

                  {/* Right — type badge + import button */}
                  <div className="flex items-center gap-3 md:gap-2 flex-shrink-0 flex-col">
                    <span className="text-xs px-2 py-0.5 rounded-full border border-green-400/20 bg-card text-text-muted">
                      {file.type === 'dir' ? 'folder' : file.name.split('.').pop()}
                    </span>
                    {file.type === 'file' && (
                      <button
  onClick={() => previewSnippet(file)}
  className="
    rounded-lg
    bg-green-400
    px-2 py-1
    text-[11px]
    md:text-xs
    md:px-3 md:py-1
    font-mono
    font-medium
    text-black
    hover:bg-green-300
    transition-colors
    opacity-100
    md:opacity-0
    md:group-hover:opacity-100
  "
>
  Preview
</button>
                    )}
                    {file.type === 'dir' && (
                      <button
                        onClick={() =>
                          getContent(
                            selectedRepo!,
                            file.path
                          )
                        }
                        className="text-xs font-mono text-text-muted border border-zinc-800 px-3 py-1 rounded-lg dark:hover:text-zinc-300 hover:border-zinc-600 transition-colors md:opacity-0 md:group-hover:opacity-100"
                      >
                        Open
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-between items-center pt-4 border-t border-border">
            <p className="text-xs text-zinc-600">
        // hover a file to <span className="text-text-muted">import</span>
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

      {previewOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center">

          <div className="w-[90vw] max-w-5xl h-[80vh] rounded-xl border border-green-400/20 bg-background flex flex-col">

            <div className="border-b border-border p-4 flex justify-between">
              

              <div>

                <h2 className="font-semibold">

                  {previewFile?.name}

                </h2>

                <p className="text-xs text-zinc-500">

                  {previewFile?.path}

                </p>

              </div>
              <button
    onClick={copyCode}
    className="rounded-lg border border-border px-3 py-1.5 text-xs hover:border-green-400/30"
>
    {copied ? (
        <>
            <i className="ti ti-check mr-1" />
            Copied
        </>
    ) : (
        <>
            <i className="ti ti-copy mr-1" />
            Copy
        </>
    )}
</button>



              <button
                onClick={() => setPreviewOpen(false)}
              >

                <i className="ti ti-x" />

              </button>

            </div>

            ...
            

            <div className="flex-1 overflow-auto">


              {previewLoading ?

                <div className="p-8 animate-pulse">

                  Loading...

                </div>

                :

                <div className="flex-1 overflow-auto">
    <SyntaxHighlighter
        language={getLanguage(previewFile?.name)}
        style={oneDark}
        customStyle={{
    margin: 0,
    padding: "24px",
    background: "transparent",
    fontSize: "13px",
    minHeight: "100%",
  }}
  codeTagProps={{
    style: {
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    },
  }}
        showLineNumbers
        wrapLongLines={true}
    >
        {previewContent}
    </SyntaxHighlighter>
</div>

              }

            </div>

            ...

            {/* footer */}

            ...

            <div className="border-t border-border p-4 flex justify-end gap-3">

              <button
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 rounded-lg border border-border"
              >

                Cancel

              </button>

              <button
                onClick={importAsSnippet}
                className="px-5 py-2 rounded-lg bg-green-400 text-black"
              >

                {status === "loading"

                  ? "Importing..."

                  : status === "success"

                    ? "Imported ✓"

                    : "Import Snippet"}

              </button>

            </div>
          </div>

        </div>
      )}


      {tokenExpired && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
            <i className="ti ti-alert-triangle text-3xl text-yellow-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              GitHub Connection Expired
            </h2>

            <p className="max-w-md text-sm text-muted-foreground">
              Your GitHub access token has expired. Go to{" "}
              <span className="font-semibold text-green-400">
                Settings → Connected Accounts
              </span>{" "}
              and reconnect GitHub to continue importing repositories.
            </p>
          </div>

          <button
            disabled
            className="cursor-not-allowed rounded-lg bg-yellow-500/20 px-6 py-3 text-sm font-semibold text-yellow-300 opacity-70"
          >
            Reconnect GitHub
          </button>
        </div>
      )}
    </main>

  );
};

export default ConnectGit;
