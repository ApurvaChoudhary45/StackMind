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
        const { code, options, userId } = await req.json()

        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const limit = await checkDailyLimit(user.id, 'code_reviews')

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
        const queryVector = await embedText(code)

        // Step 2 — Search Qdrant for similar notes
        const results = await searchVectors(queryVector, 5, userId)



        if (results.length === 0) {
            return NextResponse.json({
                answer: "I couldn't find any relevant snippets for your question. Try adding some snippets first!",
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
                content: `You are a senior code reviewer for StackMind — a developer productivity tool.

Review the following code and return a JSON object with this exact structure:
{
    "items": [
        {
            "type": "error" | "warning" | "suggestion",
            "title": "short title (5 words max)",
            "description": "specific explanation (1-2 sentences)"
        }
    ],
    "score": number between 0 and 100
}

Review focus areas: ${options.join(', ')}

User's coding patterns from their notes:
${context}

Code to review:
${code}

Rules:
- "error" = bugs, missing await, undefined variables, crashes
- "warning" = missing error handling, security risks, bad patterns  
- "suggestion" = improvements, better syntax, readability
- Reference the user's notes when relevant ("Based on your notes, you usually...")
- Be specific — mention exact line issues not vague advice
- Score: 90-100 = excellent, 70-89 = good, 50-69 = needs work, below 50 = major issues
- Return ONLY valid JSON — no markdown, no explanation
- Maximum 6 review items`
            }]
        })

        const rawAnswer = message.content[0].type === 'text'
            ? message.content[0].text.trim()
            : '{}'

        const cleaned = rawAnswer.replace(/```json|```/g, '').trim()

        let reviewData = { items: [], score: 0 }
        try {
            reviewData = JSON.parse(cleaned)
        } catch (err) {
            console.error('Failed to parse review:', cleaned)
        }
        return NextResponse.json({
            items: reviewData.items,
            score: reviewData.score,
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