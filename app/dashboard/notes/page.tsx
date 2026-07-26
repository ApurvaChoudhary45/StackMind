// app/dashboard/notes/page.tsx
import AddNote from '@/components/AddNote'
import NotesGrid from '@/components/NoteSec';
import { createClient } from '@/lib/supabase/server'
import { redirect } from "next/navigation";

export default async function NotesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if(!user) redirect('/Login')


    const { data: notes } = await supabase
        .from('notes')
        .select('*, projects(name, id)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

    return (
        <div className="p-6 bg-background h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <p className="font-mono text-sm text-zinc-600">
                    // <span className="text-text-muted">all notes</span> — {notes?.length ?? 0} total
                </p>
                <AddNote/>
            </div>

            {notes?.length === 0 ? <div className="flex items-center justify-center h-full">
  <span className="text-gray-400 text-lg font-medium font-mono">
    No Notes Found
  </span>
</div> : <NotesGrid notes={notes ?? []}/>}
        </div>
    )
}