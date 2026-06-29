// app/dashboard/bugs/page.tsx
import AddBugs from '@/components/AddBugs'
import { createClient } from '@/lib/supabase/server'

const columns = ['todo', 'in_progress', 'done'] as const
const columnConfig = {
    todo: { label: 'To do', color: 'text-zinc-500' },
    in_progress: { label: 'In progress', color: 'text-amber-400' },
    done: { label: 'Done', color: 'text-green-400' },
}
const priorityConfig = {
    high: 'text-red-400 bg-red-950/50 border-red-400/20',
    medium: 'text-amber-400 bg-amber-950/50 border-amber-400/20',
    low: 'text-green-400 bg-green-950/50 border-green-400/20',
}

export default async function BugsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: bugs } = await supabase
        .from('bugs')
        .select('*, projects(name)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

    return (
        <div className="p-6 bg-black/90 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <p className="font-mono text-sm text-zinc-600">
                    // <span className="text-green-400">all bugs</span> — {bugs?.length ?? 0} total
                </p>
                <AddBugs/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {columns.map(col => {
                    const colBugs = bugs?.filter(b => b.status === col) ?? []
                    const config = columnConfig[col]
                    return (
                        <div key={col} className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-900">
                                <span className={`font-mono text-xs font-medium ${config.color}`}>{config.label}</span>
                                <span className="text-xs font-mono text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full">{colBugs.length}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {colBugs.map(bug => (
                                    <div key={bug.id} className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-lg p-3 cursor-pointer transition-colors">
                                        <p className="font-mono text-xs text-zinc-700 mb-1">{(bug.projects as any)?.name}</p>
                                        <p className="text-sm text-zinc-300 font-medium mb-2">{bug.title}</p>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-xs font-mono border px-2 py-0.5 rounded-full ${priorityConfig[bug.priority as keyof typeof priorityConfig] ?? priorityConfig.low}`}>
                                                {bug.priority}
                                            </span>
                                            <span className="text-xs font-mono text-zinc-700">
                                                {new Date(bug.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}