import { canCreateProject } from '@/lib/limit'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'



export async function POST(req: NextRequest) {
    try {

        const body = await req.json().catch(() => null)

        const { name, description } = body ?? {}


        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
        if (typeof name !== 'string' || !name.trim() ||
            (description != null && typeof description !== 'string')) {
            return NextResponse.json({ error: 'A project name is required.' }, { status: 400 })
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
            name: name.trim(),
            description: description,
            user_id: user?.id
        })

        if (projects.error) throw projects.error
        return NextResponse.json({ message: 'Created', projects }, { status: 201 })
    } catch (error) {
        console.error(error)

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }

}