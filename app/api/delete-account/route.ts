// app/api/disconnect/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
export async function DELETE(req: NextRequest) {
    try {

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        // Admin client to delete from auth.users
        const adminClient = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Delete User
        const { error } = await adminClient.auth.admin.deleteUser(user.id)
        if (error) throw new Error(error.message)

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Delete error:', error)
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}