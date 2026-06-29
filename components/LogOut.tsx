  'use client'

  import { createClient } from '@/lib/supabase/client'

  import { useRouter } from 'next/navigation'

  import { useEffect } from 'react'

  type SidebarProps = {
      collapsed: boolean
      // setcollapsed: React.Dispatch<React.SetStateAction<boolean>>
  }

  const LogOut = ({collapsed} : SidebarProps) => {

    const supabase = createClient()
    const router = useRouter()

    
    const handleLogOut = async () => {
      await supabase.auth.signOut()
      router.push('/Login')
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
        {collapsed ? <button><i className="ti ti-logout cursor-pointer"></i></button> : <button onClick={handleLogOut} className='flex gap-12  items-center  rounded-lg text-sm text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer'>
        <div className='flex items-center gap-2'>
          <i className="ti ti-logout"></i>
          <span className='font-mono'>Log out</span>
          </div>
          <span className='font-mono text-xs'>Alt + K</span>
        </button>}
      </div>
    )
  }

  export default LogOut
