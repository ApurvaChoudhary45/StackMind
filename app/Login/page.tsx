'use client'

import { createClient } from '@/lib/supabase/client'

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-2">StackMind</h1>
      <p className="text-gray-500 mb-8">Your second brain for dev projects</p>
      <button
        onClick={signInWithGitHub}
        className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
      >
        Continue with GitHub
      </button>
    </div>
  )
}