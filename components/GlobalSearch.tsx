'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Result = {
    id: string,
    title: string,
    type: string,
    project_id: string
}

const GlobalSearch = () => {
    const [isOpen, setisOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Result[]>([])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key == 'k') {
                e.preventDefault()
                setisOpen(prev => !prev)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => document.removeEventListener('keydown', handleKeyDown) // CleanUp is required to avoid memory leaks
    }, [])


    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        timer = setTimeout(() => {
            const display = async () => {
                const data = await fetch(`/api/search?q=${query}`)
                const res = await data.json()
                console.log(res?.result)
                setResults(res?.result)
            }
            display()
        }, 1000);

        return () => clearTimeout(timer) // Clean up is required
    }, [query])



    return (
        <div>
            {isOpen && <div className="fixed inset-0 flex justify-center items-center bg-black/20 p-5">
                <div className="bg-black/90 rounded-2xl md:h-[60vh] md:w-1/2 p-7 border-2 border-white">
                    <div className="flex flex-col gap-8">
                        <h1 className="text-green-400 font-bold md:text-xl text-sm">Search for anything...</h1>
                        <input type="text" placeholder="Type here" value={query} onChange={(e) => setQuery(e.target.value)} className="text-green-400 p-2 border-2 rounded-2xl" />
                    </div>
                    <div className="mt-7">
                        <h1 className="text-green-400 md:text-xl text-sm">Search Results....</h1>
                        <div>
                            {results.length === 0 ? <p className="text-white">No results found</p> : Array.isArray(results) && results.map(item => (
                                <div key={item?.id}>

                                    {item.type === 'bug' ? (<Link href={`/dashboard/projects/${item?.project_id}/bugs`}><div className="flex justify-between items-center"><h1 className="text-red-200">{item?.title}</h1>
                                        <p className="text-red-400">{item?.type}</p></div></Link>) :

                                        item.type === 'snippet' ? (<Link href={`/dashboard/projects/${item?.project_id}/snippets`}><div className="flex justify-between items-center"><h1 className="text-green-400">{item?.title}</h1>
                                            <p className="text-green-200">{item?.type}</p></div></Link>) :

                                            (<Link href={`/dashboard/projects/${item?.project_id}/notes`}><div className="flex justify-between items-center"><h1 className="text-blue-400">{item?.title}</h1>
                                                <p className="text-blue-200">{item?.type}</p></div></Link>)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default GlobalSearch

