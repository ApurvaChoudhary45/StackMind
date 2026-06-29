// app/dashboard/notes/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function NotesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: notes } = await supabase
        .from('notes')
        .select('*, projects(name, id)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

    return (
        <div className="p-6 bg-black/90 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <p className="font-mono text-sm text-zinc-600">
                    // <span className="text-green-400">all notes</span> — {notes?.length ?? 0} total
                </p>
                <button className="flex items-center gap-2 bg-green-400 text-black text-sm font-semibold px-4 py-2 rounded-lg">
                    + Add note
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {notes?.map(note => (
                    <div key={note.id} className="bg-zinc-950 border border-zinc-900 hover:border-green-400/20 rounded-xl p-4 transition-colors cursor-pointer">
                        <p className="font-mono text-xs text-zinc-700 mb-1">{(note.projects as any)?.name}</p>
                        <h3 className="text-sm font-medium text-zinc-200 mb-1">{note.title}</h3>
                        <p className="text-xs text-zinc-600 line-clamp-2 mb-3 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: note.content }}
                        />
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1 flex-wrap">
                                {note.tags?.map((tag: string, i: number) => (
                                    <span key={i} className="text-xs font-mono text-green-400 bg-green-950/50 border border-green-400/10 px-2 py-0.5 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <span className="text-xs font-mono text-zinc-700">
                                {new Date(note.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}