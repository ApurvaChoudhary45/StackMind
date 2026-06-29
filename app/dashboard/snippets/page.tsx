// app/dashboard/snippets/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function SnippetsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: snippets } = await supabase
        .from('snippets')
        .select('*, projects(name)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

    return (
        <div className="p-6 bg-black/90 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <p className="font-mono text-sm text-zinc-600">
                    // <span className="text-green-400">all snippets</span> — {snippets?.length ?? 0} total
                </p>
                <button className="flex items-center gap-2 bg-green-400 text-black text-sm font-semibold px-4 py-2 rounded-lg">
                    + Add snippet
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2  gap-3">
                {snippets?.map(snippet => (
                    <div key={snippet.id} className="bg-zinc-950 border border-zinc-900 hover:border-green-400/20 rounded-xl overflow-hidden transition-colors cursor-pointer">
                        <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-900">
                            <span className="text-sm font-medium text-zinc-200">{snippet.title}</span>
                            <span className="text-xs font-mono text-green-400 bg-green-950/50 border border-green-400/10 px-2 py-0.5 rounded-full">
                                {snippet.language}
                            </span>
                        </div>
                        <pre className="px-4 py-3 bg-zinc-950/80 font-mono text-xs text-zinc-600 leading-relaxed overflow-hidden max-h-40 overflow-y-auto">
                            {snippet.code}
                        </pre>
                        <div className="flex justify-between items-center px-4 py-2 border-t border-zinc-900 bottom-0 relative">
                            <span className="text-xs font-mono text-zinc-700">{(snippet.projects as any)?.name}</span>
                            <div className="flex gap-3">
                                <button className="text-zinc-600 hover:text-green-400 transition-colors text-sm">
                                    Copy
                                </button>
                                <button className="text-zinc-600 hover:text-red-400 transition-colors text-sm">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}