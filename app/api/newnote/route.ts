
import { canCreateNote } from '@/lib/limit'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'



export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { data: projects } = await supabase.from('projects').select('*').order('created_at', { ascending: false })

        return NextResponse.json({ message: 'Fetched', projects })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }

}