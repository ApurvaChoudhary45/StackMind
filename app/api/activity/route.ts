import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { recordActivity } from '@/lib/activity'
import { clientActivityEvents } from '@/lib/client-activity'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json().catch(() => null)
    if (typeof body?.event !== 'string' || !Object.hasOwn(clientActivityEvents, body.event)) {
        return NextResponse.json({ error: 'Unknown activity.' }, { status: 400 })
    }
    const event = clientActivityEvents[body.event as keyof typeof clientActivityEvents]
    await recordActivity(user.id, event.action, event.type, event.title)
    return NextResponse.json({ success: true })
}
