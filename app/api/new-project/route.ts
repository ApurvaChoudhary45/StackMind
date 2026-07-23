import { canCreateProject } from '@/lib/limit'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'



export async function POST(req: NextRequest) {
    try {

        const body = await req.json()

        const { name, description } = body


        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
        const limit = await canCreateProject(user.id)

        if (!limit.allowed) {
            return NextResponse.json(
                {
                    error: limit.reason,
                    upgrade: true,
                },
                {
                    status: 403,
                }
            )
        }


        const projects = await supabase.from('projects').insert({
            name: name,
            description: description,
            user_id: user?.id
        })

        return NextResponse.json({ message: 'Created', projects })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }

}