'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
// import { FcGoogle } from 'react-icons/fc'       // Google
// import { FaTwitter } from 'react-icons/fa'     // Twitter
// import { FaGithub } from 'react-icons/fa'      // GitHub
export default function LoginPage() {
  const supabase = createClient()

  async function signInWithGitHub() {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }
  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <>
      <div className='p-4 bg-black/90'>
        <Link href='/'><span className="font-mono text-green-400 text-lg px-5">Stack<span className="text-gray-500">//</span>Mind</span></Link>
      </div>
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-900 rounded-2xl overflow-hidden border border-green-400/20">

          {/* Left: Welcome / Branding */}
          <aside className="hidden md:flex flex-col justify-center items-start p-8 bg-black border-r border-green-400/20">
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
          <div className="flex flex-col items-center justify-center bg-black/10 gap-2">
          <button
            onClick={signInWithGitHub}
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 cursor-pointer"
          >
            Continue with GitHub
          </button>
          <button onClick={signInWithGoogle} className='bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800'>
            Continue with Google
          </button>
        </div>
        </div>
        
      </div>

    </>
  )
}