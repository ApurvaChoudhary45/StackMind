import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { canCreateSnippet } from '@/lib/limit'

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

        const { project_id } = await req.json()

        // Check free/pro limit
        const limit = await canCreateSnippet(user.id)

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

        // Create an empty snippet
        const { data, error } = await supabase
            .from('snippets')
            .insert({
                title: '',
                description: '',
                language: '',
                code: '',
                project_id,
                user_id: user.id,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        console.error(error)

        return NextResponse.json(
            {
                error: error.message || 'Failed to create snippet',
            },
            {
                status: 500,
            }
        )
    }
}