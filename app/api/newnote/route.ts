
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'



export async function GET(req: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    const { data : projects } = await supabase.from('projects').select('*').order('created_at', { ascending: false })

    return NextResponse.json({message : 'Fetched', projects})
}