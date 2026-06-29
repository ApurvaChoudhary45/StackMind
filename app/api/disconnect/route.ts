// app/api/disconnect/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { provider } = await req.json()

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        // Safety check
        if ((user.identities?.length ?? 0) <= 1) {
            return NextResponse.json({ error: 'Cannot disconnect only provider' }, { status: 400 })
        }

        // Find the identity
        const identity = user.identities?.find(i => i.provider === provider)
        if (!identity) return NextResponse.json({ error: 'Provider not found' }, { status: 400 })

        // Unlink it
        const { error } = await supabase.auth.unlinkIdentity(identity)
        if (error) throw new Error(error.message)

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Disconnect error:', error)
        return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 })
    }
}