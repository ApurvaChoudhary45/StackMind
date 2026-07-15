import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import JournalClient from '@/components/JournalClient'

export default async function JournalPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/Login')

    const { data: entries } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    return (
        <JournalClient
            entries={entries ?? []}
            userId={user.id}
        />
    )
}