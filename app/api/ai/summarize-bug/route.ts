import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { title, description } = await request.json()

  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `You are a senior developer helping debug issues. Analyze this bug and provide:
1. A clear explanation of what's likely causing it
2. 2-3 specific steps to fix it
3. How to prevent it in future

Bug title: ${title}
Bug description: ${description}

Keep your response concise and practical.`
        }
      ]
    })
  })

  const data = await response.json()
  console.log(JSON.stringify(data))
  if (!data.choices?.[0]?.message?.content) {
    return NextResponse.json({ analysis: 'AI analysis temporarily unavailable. Please try again.' })
  }

  const text = data.choices[0].message.content
  return NextResponse.json({ analysis: text })
}