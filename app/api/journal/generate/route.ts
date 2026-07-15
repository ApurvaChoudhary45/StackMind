import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

// ─── Admin client — needed to read all users data ─────────────
// Regular client only sees data for the logged in user
// Admin client sees everything — used by cron job
const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Generate journal for ONE user ────────────────────────────
async function generateJournalForUser(userId: string) {
    const today = new Date().toISOString().split('T')[0] // "2026-07-14"
    const startOfDay = `${today}T00:00:00.000Z`
    const endOfDay = `${today}T23:59:59.999Z`

    // Step 1 — Check if entry already exists for today
    const { data: existing } = await adminSupabase
        .from('journal_entries')
        .select('id')
        .eq('user_id', userId)
        .eq('date', today)
        .single()

    if (existing) {
        console.log(`Journal already exists for user ${userId} on ${today}`)
        return { skipped: true }
    }

    // Step 2 — Fetch today's activity in parallel
    const [
        { data: notes },
        { data: bugs },
        { data: snippets },
        { data: projects }
    ] = await Promise.all([
        adminSupabase
            .from('notes')
            .select('title, created_at, projects(name)')
            .eq('user_id', userId)
            .gte('created_at', startOfDay)
            .lte('created_at', endOfDay),

        adminSupabase
            .from('bugs')
            .select('title, status, priority, projects(name)')
            .eq('user_id', userId)
            .gte('created_at', startOfDay)
            .lte('created_at', endOfDay),

        adminSupabase
            .from('snippets')
            .select('title, language, projects(name)')
            .eq('user_id', userId)
            .gte('created_at', startOfDay)
            .lte('created_at', endOfDay),

        adminSupabase
            .from('projects')
            .select('name')
            .eq('user_id', userId)
    ])

    // Step 3 — If nothing happened today, skip
    const totalActivity = (notes?.length ?? 0) + (bugs?.length ?? 0) + (snippets?.length ?? 0)
    if (totalActivity === 0) {
        console.log(`No activity for user ${userId} on ${today}`)
        return { skipped: true, reason: 'no activity' }
    }

    // Step 4 — Find most active project
    const projectCounts: Record<string, number> = {}
    const allItems = [...(notes ?? []), ...(bugs ?? []), ...(snippets ?? [])]
    allItems.forEach((item: any) => {
        const name = item.projects?.name
        if (name) projectCounts[name] = (projectCounts[name] ?? 0) + 1
    })
    const mostActiveProject = Object.entries(projectCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

    // Step 5 — Build activity context for Claude
    const activityContext = `
Date: ${today}

Notes created (${notes?.length ?? 0}):
${notes?.map(n => `- ${n.title}`).join('\n') || 'None'}

Bugs tracked (${bugs?.length ?? 0}):
${bugs?.map(b => `- ${b.title} (${b.status}, ${b.priority} priority)`).join('\n') || 'None'}

Snippets saved (${snippets?.length ?? 0}):
${snippets?.map(s => `- ${s.title} (${s.language})`).join('\n') || 'None'}

Most active project: ${mostActiveProject ?? 'None'}
    `.trim()

    // Step 6 — Generate summary with Claude
    const message = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 300,
        messages: [{
            role: 'user',
            content: `You are a dev journal assistant for StackMind.

Based on this developer's activity today, write a short friendly summary (3-4 sentences max).

Activity:
${activityContext}

Rules:
- Write in second person ("You...")
- Be specific — mention actual titles and projects
- Keep it encouraging and developer-focused
- No bullet points — flowing prose only
- Max 3-4 sentences`
        }]
    })

    const summary = message.content[0].type === 'text'
        ? message.content[0].text.trim()
        : 'A productive day of development!'

    // Step 7 — Save to Supabase
    const { error } = await adminSupabase
        .from('journal_entries')
        .insert({
            user_id: userId,
            date: today,
            summary,
            notes_count: notes?.length ?? 0,
            bugs_fixed: bugs?.filter(b => b.status === 'fixed').length ?? 0,
            snippets_count: snippets?.length ?? 0,
            most_active_project: mostActiveProject,
            tags: snippets?.map(s => s.language).filter(Boolean) ?? []
        })

    if (error) throw new Error(error.message)

    return { success: true, summary }
}

// ─── Route Handler ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json()

        if (userId) {
            // Manual trigger — generate for specific user
            const result = await generateJournalForUser(userId)
            return NextResponse.json(result)
        } else {
            // Cron trigger — generate for ALL users
            const { data: users } = await adminSupabase
                .from('profiles')
                .select('id')

            if (!users?.length) {
                return NextResponse.json({ message: 'No users found' })
            }

            const results = await Promise.allSettled(
                users.map(u => generateJournalForUser(u.id))
            )

            return NextResponse.json({
                processed: results.length,
                success: results.filter(r => r.status === 'fulfilled').length
            })
        }

    } catch (error) {
        console.error('Journal generation failed:', error)
        return NextResponse.json({ error: 'Failed to generate journal' }, { status: 500 })
    }
}

// ─── GET handler for Vercel Cron ──────────────────────────────
// Vercel cron jobs use GET requests not POST
export async function GET() {
    try {
        // Fetch all user IDs
        const { data: users } = await adminSupabase
            .auth.admin.listUsers()

        if (!users?.users?.length) {
            return NextResponse.json({ message: 'No users' })
        }

        const results = await Promise.allSettled(
            users.users.map(u => generateJournalForUser(u.id))
        )

        return NextResponse.json({
            processed: results.length,
            success: results.filter(r => r.status === 'fulfilled').length
        })

    } catch (error) {
        console.error('Cron journal failed:', error)
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}