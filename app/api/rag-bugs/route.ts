import { NextRequest, NextResponse } from 'next/server'
import { embedText } from '@/lib/embedding'
import { searchVectors } from '@/lib/qdrant'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { checkDailyLimit } from '@/lib/limit'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(req: NextRequest) {
    try {

    
        const { query, userId } = await req.json()

        const supabase = await createClient()
        
                const { data: { user } } = await supabase.auth.getUser()
        
                if (!user) {
                    return NextResponse.json(
                        { error: 'Unauthorized' },
                        { status: 401 }
                    )
                }

                const limit = await checkDailyLimit(user.id, 'ai_queries')

if (!limit.allowed) {
    return NextResponse.json(
        {
            error: limit.reason,
            upgrade: true
        },
        {
            status: 403
        }
    )
}

        // Step 1 — Run both in parallel (faster)
        const [queryVector] = await Promise.all([
            embedText(query),
            
        ])

        // Step 2 — Search Qdrant for related notes + fetch bugs from Supabase
        const [noteResults, { data: bugs }] = await Promise.all([
            searchVectors(queryVector, 5, userId),
            supabase
                .from('bugs')
                .select('*, projects(name)')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
        ])

        // Step 3 — Build notes context (graceful fallback if none)
        const notesContext = noteResults.length > 0
            ? noteResults.map((result, index) =>
                `Note ${index + 1} — ${result.title}:\n${result.content}`
            ).join('\n\n')
            : null

        // Step 4 — Build bugs context
        const bugsContext = bugs && bugs.length > 0
            ? bugs.map((bug, index) =>
                `Bug ${index + 1}:
                - Title: ${bug.title}
                - Status: ${bug.status}
                - Priority: ${bug.priority}
                - Project: ${(bug.projects as any)?.name ?? 'Unknown'}
                - Created: ${new Date(bug.created_at).toLocaleDateString()}`
            ).join('\n\n')
            : 'No bugs found.'

        // Step 5 — Send to Claude with hybrid context
        const message = await anthropic.messages.create({
            model: 'claude-haiku-4-5',
            max_tokens: 1024,
            messages: [{
                role: 'user',
                content: `You are a bug analysis assistant for StackMind — a developer productivity tool.

${notesContext
                        ? `Related notes from the user:\n${notesContext}\n\n`
                        : 'No related notes found for this query.\n\n'
                    }
User's bugs:
${bugsContext}

Answer this question: ${query}

Important:
- Use bug data as your primary source
- If related notes exist and are relevant, use them to add context
- Be concise and specific — mention bug titles, statuses and priorities where relevant
- If you reference a note, say which one
- Never make up information not in the provided context`
            }]
        })

        const answer = message.content[0].type === 'text'
            ? message.content[0].text
            : ''

        return NextResponse.json({
            answer,
            sources: noteResults.map(r => ({
                title: r.title,
                score: r.score
            })),
            bugsAnalyzed: bugs?.length ?? 0
        })

    } catch (error) {
        console.error('Bug RAG search failed:', error)
        return NextResponse.json(
            { error: 'Search failed' },
            { status: 500 }
        )
    }
}