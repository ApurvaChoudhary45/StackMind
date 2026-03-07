import CreateProject from '@/components/CreateProject'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const {data : projects} = await supabase.from('projects').select('*').order('created_at', {ascending : false})

  return (
    <>
    <div className="p-8 bg-black/90">
      <nav className='flex justify-between items-center'>
        <h1 className="text-2xl font-bold text-green-400">Welcome to StackMind</h1>
      <p className="text-gray-400">Logged in as: {user.email}</p>
      </nav>
    </div>
    <div className='bg-black/80 h-[85vh]'>
      <h1 className='py-3 text-2xl font-extrabold text-green-400 font-mono text-center'>Your Projects</h1>
      {projects?.length === 0 ? <div className='flex justify-center items-center flex-col gap-3 min-h-[60vh]'><p className='text-sm text-gray-400'>No projects created yet!</p><CreateProject/></div> : projects?.map((item, id)=>{
        return (
          <div key={id}>
          <h1>{item.name}</h1>
          </div>
        )
      })}
    </div>
    
    </>
  )
}