import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { embedText } from '@/lib/embedding'
import { storeVectors, setupCollection } from '@/lib/qdrant'
import Anthropic from '@anthropic-ai/sdk'
import { canCreateProject } from '@/lib/limit'
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

// ─── Tag Generation ───────────────────────────────────────────
// We ask Claude to read the note and return relevant tags
// The prompt is very specific — we tell it to return ONLY a JSON array
// No extra text, no explanation, just ["tag1", "tag2"]
// This makes parsing reliable

async function generateTags(title: string, content: string): Promise<string[]> {
    try {
        const message = await anthropic.messages.create({
            model: 'claude-haiku-4-5',
            max_tokens: 100, // Tags are short — no need for more tokens
            messages: [{
                role: 'user',
                content: `You are a tagging system for a developer notes app.

Analyze this note and return 3-5 relevant technical tags.

Title: ${title}
Content: ${content}

Rules:
- Return ONLY a JSON array of strings
- No explanation, no extra text, just the array
- Tags should be short (1-2 words max)
- Focus on technologies, concepts, and topics
- Example: ["React", "useEffect", "hooks", "performance"]

Return the JSON array now:`
            }]
        })

        // Extract the text response from Claude
        let text = message.content[0].type === 'text'
            ? message.content[0].text.trim()
            : '[]'

        text = text.replace(/```json|```/g, "").trim(); // Even if you say “return ONLY a JSON array,” Claude wrapped the response in Markdown fences (```json … ```). That broke JSON.parse. (text = text.replace(/```json|```/g, "").trim())

        // Make sure to first replace the markdown fences to a valid json and then parse it

        // Seeing the raw Claude response (Claude raw:) immediately revealed the mismatch. Without logging, you’d just see [] and wonder why tags weren’t saving. check the below console log 

        // console.log("Claude raw:", message.content)

        // Parse the JSON array Claude returned
        // If parsing fails for any reason, return empty array
        let tags: string[] = [];
        try {   
            tags = JSON.parse(text); // Parse json only if it is a valid json
        } catch (err) {
            console.error("Failed to parse tags:", text, err);
            tags = [];
        }

        return Array.isArray(tags) ? tags : [];

    } catch (error) {
        // Tag generation failing should NEVER break note saving
        // So we catch the error and return empty array silently
        console.error('Tag generation failed:', error)
        return []
    }
}

export async function POST(req: NextRequest) {
    try {
        const { title, content, projectId, userId } = await req.json()

        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // const limit = await canCreateProject(user.id)

        // if (!limit.allowed) {
        //     return NextResponse.json(
        //         {
        //             error: limit.reason,
        //             upgrade: true,
        //         },
        //         {
        //             status: 403,
        //         }
        //     )
        // }

        // Step 1 — Generate tags using Claude (runs in parallel with nothing yet)
        // We do this BEFORE saving so we can store tags in the same insert
        const tags = await generateTags(title, content)
        console.log('Generated tags:', tags)

        // Step 2 — Save to Supabase WITH tags included
        const { data: note, error } = await supabase
            .from('notes')
            .insert({
                title,
                content,
                project_id: projectId,
                user_id: userId,
                tags  // ← tags saved in the same insert, no extra DB call needed
            })
            .select()
            .single()

        if (error) throw new Error(error.message)

        // Step 3 — Embed the note for RAG search
        const textToEmbed = `${title} ${content}`
        const vector = await embedText(textToEmbed)

        // Step 4 — Store in Qdrant
        await setupCollection()
        await storeVectors([{
            id: note.id,
            vector,
            payload: {
                noteId: note.id,
                title: note.title,
                content: note.content,
                projectId,
                userId
            }
        }])

        return NextResponse.json({ success: true, note })

    } catch (error) {
        console.error('Failed to create note:', error)
        return NextResponse.json(
            { error: 'Failed to create note' },
            { status: 500 }
        )
    }
}