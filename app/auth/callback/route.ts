import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { sendWelcomeEmail } from '@/lib/email'

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)


export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')



  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log(data)
    if (data.session?.provider_token) {
      await supabase.from('github_tokens').upsert({
        user_id: data.session.user.id,
        token: data.session.provider_token,
        updated_at: new Date().toISOString()
      })
    }
    const session = data?.session
    const user = session?.user

    if (!user) {
      console.error('No user found in session:', session)
      return NextResponse.redirect(`${origin}/login?error=no_user`)
    }

    // Check if subscription exists
    const { data: existingSub } = await adminSupabase
      .from('subscriptions')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    if (!existingSub) {
      // New user — create free subscription
      await adminSupabase.from('subscriptions').insert({
        user_id: user.id,
        plan: 'free',
        status: 'active'
      })
    }

    // We need to add a domain a personal one in resend so that email can be send to other emails as well


    const created = new Date(user.created_at)
    const now = new Date()
    const diffMinutes = (now.getTime() - created.getTime()) / 1000 / 60
    const isNewUser = diffMinutes < 5

    if (isNewUser) {
      const userName = user?.user_metadata?.full_name
        ?? user?.user_metadata?.user_name
        ?? user?.email?.split('@')[0]
        ?? 'Developer'

      // Send welcome email — don't await, don't block redirect
      sendWelcomeEmail(user?.email!, userName)
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}