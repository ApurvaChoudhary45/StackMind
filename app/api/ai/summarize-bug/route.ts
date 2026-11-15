import { recordActivity } from '@/lib/activity'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkDailyLimit } from '@/lib/limit'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (typeof body?.title !== 'string' || !body.title.trim()) {
    return NextResponse.json({ error: 'A bug title is required.' }, { status: 400 })
  }

  const limit = await checkDailyLimit(user.id, 'ai_queries')
  if (!limit.allowed) {
    return NextResponse.json({ error: limit.reason, upgrade: true }, { status: 403 })
  }

  const { title, description } = body

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a senior developer helping debug issues. Analyze this bug and provide:
1. A clear explanation of what's likely causing it
2. 2-3 specific steps to fix it
3. How to prevent it in future

Important:
- Put each step on a new line
- Add a blank line between steps
- Keep the response concise and practical

Bug title: ${title} 
Bug description: ${description}

Keep your response concise and practical.`
        }
      ]
    })
  })

  const data = await response.json()
  if (!response.ok || !data.content?.[0]?.text) {
    return NextResponse.json({ error: 'AI analysis temporarily unavailable.' }, { status: 502 })
  }
  const text = data.content[0].text
        await recordActivity(user.id, 'used', 'ai', 'Analyzed a bug with AI')
  return NextResponse.json({ analysis: text })
}