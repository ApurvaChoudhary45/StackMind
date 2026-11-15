import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { canCreateBug } from '@/lib/limit'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const {
            title,
            description,
            priority,
            project_id,
        } = await req.json().catch(() => ({})) ?? {}

        if (typeof title !== 'string' || !title.trim() || typeof project_id !== 'string' ||
            !['low', 'medium', 'high'].includes(priority)) {
            return NextResponse.json({ error: 'A title, priority, and project are required.' }, { status: 400 })
        }
        const { data: project, error: projectError } = await supabase.from('projects')
            .select('id').eq('id', project_id).eq('user_id', user.id).maybeSingle()
        if (projectError) throw projectError
        if (!project) return NextResponse.json({ error: 'Project not found.' }, { status: 404 })

        const limit = await canCreateBug(user.id)

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

        const { data, error } = await supabase
            .from('bugs')
            .insert({
                title,
                description,
                priority,
                status: 'open',
                project_id,
                user_id: user.id,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data, { status: 201 })

    } catch (error: any) {
        console.error(error)

        return NextResponse.json(
            {
                error: error.message || 'Failed to create bug.',
            },
            {
                status: 500,
            }
        )
    }
}