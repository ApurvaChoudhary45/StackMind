'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'       // Google
import { FaTwitter } from 'react-icons/fa'     // Twitter
import { FaGithub } from 'react-icons/fa'      // GitHub
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
    <div className='bg-black/90'>
      <div className='p-4 '>
        <Link href='/'><span className="font-mono text-green-400 text-lg px-5">Stack<span className="text-gray-500">//</span>Mind</span></Link>
      </div>
      <div className='md:grid grid-cols-2'>
        <div className='bg-black/80'>

        </div>
        <div className="flex flex-col items-center justify-center md:min-h-screen h-screen bg-black/10 gap-2">
          <h1 className="text-4xl font-bold mb-2 text-green-400">StackMind</h1>
          <p className="text-gray-500 mb-8">Your second brain for dev projects</p>
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
  )
}