import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { title, description } = await request.json()

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemma-3-4b-it:free',
      messages: [
        {
          role: 'user',
          content: `You are a senior developer helping debug issues. Analyze this bug and provide:
1. A clear explanation of what's likely causing it
2. 2-3 specific steps to fix it
3. How to prevent it in future

Bug title: ${title}
Bug description: ${description}

Keep your response concise and practical. Format it with clear sections.`
        }
      ]
    })
  })

  const data = await response.json()
  console.log(JSON.stringify(data))
  const text = data.choices[0].message.content

  return NextResponse.json({ analysis: text })
}