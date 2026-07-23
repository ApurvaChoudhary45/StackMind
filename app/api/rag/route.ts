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

        // Step 1 — Embed the user's question
        const queryVector = await embedText(query)

        // Step 2 — Search Qdrant for similar notes
        const results = await searchVectors(queryVector, 5, userId)



        if (results.length === 0) {
            return NextResponse.json({
                answer: "I couldn't find any relevant notes for your question. Try adding some notes first!",
                sources: []
            })
        }

        // Step 4 — Build context from retrieved notes
        const context = results.map((result, index) =>
            `Note ${index + 1} — ${result.title}:\n${result.content}`
        ).join('\n\n')

        // Step 5 — Send to Claude with context
        const message = await anthropic.messages.create({
            model: 'claude-haiku-4-5',
            max_tokens: 1024,
            messages: [{
                role: 'user',
                content: `You are a helpful assistant that answers questions based on the user's personal notes.
                
Here are the relevant notes:

${context}

Based on these notes, answer this question: ${query}

Important:
- Only use information from the notes above
- If the notes don't contain enough information, say so
- Be concise and direct
- Reference which note you're drawing from`
            }]
        })

        const answer = message.content[0].type === 'text'
            ? message.content[0].text
            : ''

        return NextResponse.json({
            answer,
            sources: results.map(r => ({
                title: r.title,
                score: r.score
            }))
        })

    } catch (error) {
        console.error('RAG search failed:', error)
        return NextResponse.json(
            { error: 'Search failed' },
            { status: 500 }
        )
    }
}