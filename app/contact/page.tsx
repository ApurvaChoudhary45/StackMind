'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)
    setSuccess(false)

    const form = e.currentTarget

    const body = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    setLoading(false)

    if (res.ok) {
      form.reset()
      setSuccess(true)
    } else {
      alert('Failed to send message.')
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-20">
      <div className="mx-auto max-w-3xl">

        <h1 className="text-5xl font-bold text-green-400 mb-4">
          Contact Us
        </h1>

        <p className="text-muted-foreground mb-12">
          Have a question, feedback, or need support? We'd love to hear from you.
        </p>

        <div className="rounded-2xl border border-border bg-card p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block mb-2 text-sm font-medium">
                Name
              </label>

              <input
                required
                name="name"
                className="w-full rounded-xl border border-border bg-background p-3 outline-none focus:border-green-400"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Email
              </label>

              <input
                required
                type="email"
                name="email"
                className="w-full rounded-xl border border-border bg-background p-3 outline-none focus:border-green-400"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Subject
              </label>

              <input
                required
                name="subject"
                className="w-full rounded-xl border border-border bg-background p-3 outline-none focus:border-green-400"
                placeholder="Payment issue"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Message
              </label>

              <textarea
                required
                rows={6}
                name="message"
                className="w-full rounded-xl border border-border bg-background p-3 outline-none resize-none focus:border-green-400"
                placeholder="How can we help?"
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-green-400 py-3 font-semibold text-black transition hover:bg-green-300 disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>

            {success && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
                Your message has been sent successfully.
              </div>
            )}

          </form>

          <div className="mt-10 border-t border-border pt-8">

            <h2 className="text-lg font-semibold text-green-400 mb-3">
              Direct Contact
            </h2>

            <p className="text-muted-foreground">
              Email:
            </p>

            <a
              href="mailto:apurvasinghchoudhary@gmail.com"
              className="text-green-400 hover:underline"
            >
              apurvasinghchoudhary@gmail.com
            </a>

            <p className="mt-5 text-sm text-muted-foreground">
              Typical response time: 24–48 business hours.
            </p>

          </div>

        </div>

      </div>
    </main>
  )
}