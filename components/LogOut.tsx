'use client'

import { createClient } from '@/lib/supabase/client'

import { useRouter } from 'next/navigation'

import { useState, useEffect } from 'react'
import SignOutOverlay from './SignOutOverlay'

type SidebarProps = {
  collapsed: boolean
  // setcollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const LogOut = ({ collapsed }: SidebarProps) => {

  const [signingOut, setSigningOut] = useState(false)

  const supabase = createClient()
  const router = useRouter()


  const handleLogOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    await new Promise(resolve => setTimeout(resolve, 800))
    router.replace('/Login')
  }

  useEffect(() => {
    const keyLogOut = async (e: KeyboardEvent) => {
      if ((e.metaKey || e.altKey) && e.key == 'k') {
        e.preventDefault()
        await handleLogOut()
      }
    }
    document.addEventListener('keydown', keyLogOut)

    return () => document.removeEventListener('keydown', keyLogOut)
  }, [])




  return (
    <div>
      {collapsed ? <button onClick={handleLogOut}><i className="ti ti-logout cursor-pointer"></i></button> : <button onClick={handleLogOut} className='flex gap-12  items-center  rounded-lg text-sm text-zinc-500 hover:text-red-600  transition-colors cursor-pointer'>
        <div className='flex items-center gap-2'>
          <i className="ti ti-logout"></i>
          <span className='font-mono'>Log out</span>
        </div>
        <span className='font-mono text-xs'>Alt + K</span>
      </button>}
      {signingOut && <SignOutOverlay/>}
    </div>
  )
}

export default LogOut
