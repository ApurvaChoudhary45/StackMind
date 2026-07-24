'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const supabase = createClient()

  const [loading, setloading] = useState(false)
  const [googleLoad, setGoogleLoad] = useState(false)

  // NEW: email/password state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isSignUp, setIsSignUp] = useState(false) // toggle between login/signup

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

  // NEW: email/password handler
  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setEmailLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        if (error) throw error
        setErrorMsg('Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        window.location.href = '/dashboard' // or wherever post-login goes
      }
    } catch (error: any) {
      console.log(error)
      setErrorMsg(error.message || 'Something went wrong')
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <>
      <div className='p-4 dark:bg-black/90 bg-card'>
        <Link href='/'><span className="font-mono text-green-400 text-lg px-5">Stack<span className="text-gray-500">//</span>Mind</span></Link>
      </div>
      <div className="h-screen dark:bg-black bg-background flex items-center justify-center p-6">
        <div className="max-w-4xl w-full flex flex-col md:grid md:grid-cols-2 gap-6 dark:bg-zinc-900 bg-background rounded-2xl overflow-hidden border border-green-400/20">

          {/* Left: Welcome / Branding */}
          <aside className=" md:flex flex-col justify-center items-start p-8 dark:bg-black bg-card border-r border-green-400/20">
            <span className="font-mono text-green-400 text-lg mb-6">
              Stack<span className="text-gray-500">//</span>Mind
            </span>
            <h1 className="text-2xl font-extrabold mb-2 font-mono dark:text-white">
              Your second brain for dev projects.
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Notes with syntax highlighting, bug tracking, and a searchable code snippet library — all in one place.
            </p>

            <div className="w-full">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-1 flex-shrink-0" />
                  <span className="dark:text-gray-400 text-gray-500">Write notes with syntax-highlighted code blocks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-1 flex-shrink-0" />
                  <span className="dark:text-gray-400 text-gray-500">Track bugs on a real-time Kanban board</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-1 flex-shrink-0" />
                  <span className="dark:text-gray-400 text-gray-500">Save and search reusable code snippets instantly</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto pt-8">
              <p className="font-mono text-xs text-gray-600">// built with Next.js + Supabase</p>
            </div>
          </aside>

          <div className="flex flex-col items-center justify-center gap-4 p-8">

            {/* OAuth buttons — unchanged */}
            {loading ? (
              <button className='cursor-not-allowed bg-black/40 px-6 py-3 rounded-lg w-full'>
                <div className='flex justify-center items-center gap-5'>
                  <i className="ti ti-loader animate-spin text-base" />
                <span className='animate-pulse font-bold text font-mono text-white'>
                  
                  Authenticating...</span>
                </div>
                
              </button>
            ) : (
              <div className='flex justify-between items-center gap-5 w-full'>
                <button
                  onClick={signInWithGitHub}
                  className="dark:bg-black/60 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-500 cursor-pointer flex justify-center items-center gap-5 font-mono w-full"
                >
                  <img src="/github.png" alt="" className='w-7.7 h-7' />
                  Continue with GitHub
                </button>
              </div>
            )}

            {googleLoad ? (
              <button className='cursor-not-allowed bg-black/40 px-6 py-3 rounded-lg w-full'>
                <div className='flex justify-center items-center gap-5'>
                  <i className="ti ti-loader animate-spin text-base" />
                <span className='animate-pulse font-bold text font-mono text-white'>
                  
                  Authenticating...</span>
                </div>
                
              </button>
            ) : (
              <div className='flex justify-between items-center gap-5 w-full'>
                <button
                  onClick={signInWithGoogle}
                  className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 cursor-pointer flex justify-center items-center gap-5 font-mono w-full"
                >
                  <img src="/google.png" alt="" className='w-7.7 h-7' />
                  Continue with Google
                </button>
              </div>
            )}

            {/* NEW: divider */}
            <div className="flex items-center gap-3 w-full my-2">
              <div className="h-px bg-gray-700 flex-1" />
              <span className="text-xs text-gray-500 font-mono">OR</span>
              <div className="h-px bg-gray-700 flex-1" />
            </div>

            {/* NEW: email/password form */}
            <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-green-400/20 text-white font-mono text-sm focus:outline-none focus:border-green-400"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-green-400/20 text-white font-mono text-sm focus:outline-none focus:border-green-400"
              />

              {errorMsg && (
                <p className="text-xs text-red-400 font-mono">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={emailLoading}
                className="w-full px-6 py-3 rounded-lg font-medium font-mono text-white bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {emailLoading
                  ? ( isSignUp ?  <div className='flex justify-center items-center gap-5'>
                  <i className="ti ti-loader animate-spin text-base" />
                <span className='animate-pulse font-bold text font-mono text-white'>
                  
                  Signing up...</span>
                </div> : <div className='flex justify-center items-center gap-5'>
                  <i className="ti ti-loader animate-spin text-base" />
                <span className='animate-pulse font-bold text font-mono text-white'>
                  
                  Signing in...</span>
                </div>)
                  : isSignUp
                    ? 'Sign up with Email'
                    : 'Sign in with Email'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setErrorMsg('')
                }}
                className="text-xs text-gray-500 hover:text-green-400 font-mono text-center"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}