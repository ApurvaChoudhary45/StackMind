'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
// import { FcGoogle } from 'react-icons/fc'       // Google
// import { FaTwitter } from 'react-icons/fa'     // Twitter
// import { FaGithub } from 'react-icons/fa'      // GitHub
export default function LoginPage() {
  const supabase = createClient()

  const [loading, setloading] = useState(false)
  const [googleLoad, setGoogleLoad] = useState(false)

  async function signInWithGitHub() {
    
    try {
      setloading(true)
      await supabase.auth.signInWithOAuth({
      provider: 'github', 
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    } catch (error) {
      console.log(error)
      setloading(false)
    }
  }
  async function signInWithGoogle() {
    try {
      setGoogleLoad(true)
      await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    } catch (error) {
      console.log(error)
      setGoogleLoad(false)
    }
  }

  return (
    <>
      <div className='p-4 bg-black/90'>
        <Link href='/'><span className="font-mono text-green-400 text-lg px-5">Stack<span className="text-gray-500">//</span>Mind</span></Link>
      </div>
      <div className="md:min-h-screen bg-black flex items-center justify-center p-6 h-[80vh]">
        <div className="max-w-4xl w-full flex flex-col md:grid md:grid-cols-2 md:gap-6 gap-6 bg-zinc-900 rounded-2xl overflow-hidden border border-green-400/20">

          {/* Left: Welcome / Branding */}
          <aside className=" md:flex flex-col justify-center items-start p-8 bg-black border-r border-green-400/20">
            <span className="font-mono text-green-400 text-lg mb-6">
              Stack<span className="text-gray-500">//</span>Mind
            </span>
            <h1 className="text-2xl font-extrabold mb-2 font-mono text-white">
              Your second brain for dev projects.
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Notes with syntax highlighting, bug tracking, and a searchable code snippet library — all in one place.
            </p>

            <div className="w-full">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-1 flex-shrink-0" />
                  <span className="text-gray-400">Write notes with syntax-highlighted code blocks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-1 flex-shrink-0" />
                  <span className="text-gray-400">Track bugs on a real-time Kanban board</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-1 flex-shrink-0" />
                  <span className="text-gray-400">Save and search reusable code snippets instantly</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto pt-8">
              <p className="font-mono text-xs text-gray-600">// built with Next.js + Supabase</p>
            </div>
          </aside>
          <div className="flex flex-col items-center justify-center  gap-4 p-8">
            {loading ? <button className='cursor-not-allowed bg-black/40 px-6 py-3 rounded-lg w-full'><span className='animate-pulse font-bold text font-mono text-white'>Loading...</span></button> : <div className='flex justify-between items-center gap-5 w-full'>
            <button
              onClick={signInWithGitHub}
              className="bg-black/60 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-500 cursor-pointer flex justify-center items-center gap-5 font-mono w-full"
            >
             <img src="/github.png" alt="" className='w-7.7 h-7' /> 
              Continue with GitHub
            </button>
            </div>}
            {googleLoad ? <button className='cursor-not-allowed bg-green-700 px-6 py-3 rounded-lg w-full'><span className='animate-pulse font-bold text font-mono text-white'>Loading...</span></button> : <div className='flex justify-between items-center gap-5 w-full'>
            <button
              onClick={signInWithGoogle}
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 cursor-pointer flex justify-center items-center gap-5 font-mono w-full"
            >
             <img src="/google.png" alt="" className='w-7.7 h-7' /> 
              Continue with Google
            </button>
            </div>}
          </div>
        </div>
        
      </div>

    </>
  )
}