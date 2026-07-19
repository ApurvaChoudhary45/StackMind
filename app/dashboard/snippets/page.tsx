// app/dashboard/snippets/page.tsx
import AddSnippet from '@/components/AddSnippet'
import { createClient } from '@/lib/supabase/server'
import { redirect } from "next/navigation";
export default async function SnippetsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if(!user) redirect('/Login')

    const { data: snippets } = await supabase
        .from('snippets')
        .select('*, projects(name)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

    return (
        <div className="p-6 bg-background min-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <p className="font-mono text-sm text-text-muted">
                    // <span className="text-green-400">all snippets</span> — {snippets?.length ?? 0} total
                </p>
                <AddSnippet />
            </div>

            {snippets?.length === 0 ? <div className="flex items-center justify-center h-full">
                <span className="text-muted text-lg font-medium font-mono">
                    No snippets Found
                </span>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {snippets?.map(snippet => (
                    <div key={snippet.id} className="bg-card border border-border hover:border-border rounded-xl transition-colors cursor-pointer">
                        <div className="flex justify-between items-center px-4 py-3 border-b border-border">
                            <span className="text-sm font-medium text-muted">{snippet.title}</span>
                            <span className="text-xs font-mono text-green-400 bg-card border border-green-400/10 px-2 py-0.5 rounded-full">
                                {snippet.language}
                            </span>
                        </div>
                        <pre className="px-4 py-3 bg-card font-mono text-xs text-text-muted leading-relaxed  max-h-40 overflow-y-auto text-wrap">
                            {snippet.code}
                        </pre>
                        {/* <div className="flex justify-between items-center px-4 py-2 border-t border-border bottom-0 relative">
                            <span className="text-xs font-mono text-zinc-700">{(snippet.projects as any)?.name}</span>
                            <div className="flex gap-3">
                                <button className="text-zinc-600 hover:text-green-400 transition-colors text-sm">
                                    Copy
                                </button>
                                <button className="text-zinc-600 hover:text-red-400 transition-colors text-sm">
                                    Delete
                                </button>
                            </div>
                        </div> */}
                    </div>
                ))}
            </div>}
        </div>
    )
}