
import LogOut from './LogOut'

import { createClient } from '@/lib/supabase/client'

import { redirect } from 'next/navigation'

const Navbar = async () => {
    const supabase =  createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if(!user) redirect('/Login')

    return (
        <div className="p-5 bg-black/90 ">
            <nav className='flex justify-between items-center'>
                <h1 className="text-2xl font-bold text-green-400">Welcome to StackMind</h1>
                <div className='flex justify-center items-center gap-6'>
                    <p className="text-gray-400">Logged in as: {user.email}</p>
                    <LogOut />
                </div>
            </nav>
        </div>
    )
}

export default Navbar
