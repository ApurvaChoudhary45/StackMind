import { Resend } from 'resend'
import { render } from '@react-email/render'
import WelcomeEmail from '@/emails/WelcomeEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, userName: string) {
    try {
        const html = await render(WelcomeEmail({ userName }))

        const { data, error } = await resend.emails.send({
            from: 'StackMind <onboarding@resend.dev>',
            to: email,
            subject: 'Welcome to StackMind 🧠',
            html  // ← pass rendered HTML instead of react component
        })

        if (error) {
            console.error('Email send failed:', error)
            return false
        }

        console.log('Welcome email sent:', data)
        return true

    } catch (error) {
        console.error('Email error:', error)
        return false
    }
}