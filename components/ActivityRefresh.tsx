'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ActivityRefresh({ userId }: { userId: string }) {
    const router = useRouter()
    useEffect(() => {
        const supabase = createClient()
        let timer: ReturnType<typeof setTimeout> | undefined
        const channel = supabase.channel('activity-feed-' + userId)
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'activity_events',
                filter: 'user_id=eq.' + userId,
            }, () => {
                clearTimeout(timer)
                timer = setTimeout(() => router.refresh(), 400)
            })
            .subscribe()
        return () => {
            clearTimeout(timer)
            void supabase.removeChannel(channel)
        }
    }, [router, userId])
    return null
}
