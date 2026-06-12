import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { title, description } = await request.json()

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
  console.log(JSON.stringify(data))
  if (!data.content?.[0]?.text) {
    return NextResponse.json({ analysis: 'AI analysis temporarily unavailable.' })
  }
  const text = data.content[0].text
  console.log(text)
  return NextResponse.json({ analysis: text })
}