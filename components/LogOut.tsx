'use client'

import { createClient } from '@/lib/supabase/client'

import { useRouter } from 'next/navigation'

const LogOut = () => {

    const supabase = createClient() 
    const router = useRouter()

    const handleLogOut = async ()=>{
        await supabase.auth.signOut()
        router.push('/Login')
    }

  return (
    <div>
      <button onClick={handleLogOut} className='text-green-400 rounded-2xl p-2 md:text-lg text-sm'>Log Out</button>
    </div>
  )
}

export default LogOut
