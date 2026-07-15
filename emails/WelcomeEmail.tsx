import * as React from 'react'

type Props = {
    userName: string
}

export default function WelcomeEmail({ userName }: Props) {
    return (
        <html>
            <body style={{ backgroundColor: '#0a0a0a', fontFamily: 'monospace', padding: '40px 20px' }}>
                <div style={{ maxWidth: '560px', margin: '0 auto' }}>

                    {/* Logo */}
                    <div style={{ marginBottom: '32px' }}>
                        <span style={{ color: '#4ade80', fontSize: '20px', fontWeight: 'bold' }}>
                            Stack//Mind
                        </span>
                    </div>

                    {/* Greeting */}
                    <h1 style={{ color: '#e5e5e5', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                        Welcome, {userName}! 🧠
                    </h1>

                    <p style={{ color: '#71717a', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
                        Your second brain for dev projects is ready. Here's what you can do with StackMind:
                    </p>

                    {/* Features */}
                    {[
                        { icon: '📝', title: 'Notes', desc: 'Write notes with syntax highlighting and code blocks' },
                        { icon: '🐛', title: 'Bug Tracker', desc: 'Track bugs with a Kanban board' },
                        { icon: '📦', title: 'Snippets', desc: 'Save reusable code — never rewrite the same utility twice' },
                        { icon: '🤖', title: 'Ask AI', desc: 'Ask questions powered by YOUR notes and bug history' },
                        { icon: '🗓️', title: 'Dev Journal', desc: 'Automatic daily summary of everything you built' },
                    ].map((feature) => (
                        <div key={feature.title} style={{ display: 'flex', gap: '12px', marginBottom: '16px', padding: '12px', backgroundColor: '#0d0d0d', borderRadius: '8px', border: '1px solid #1f1f1f' }}>
                            <span style={{ fontSize: '20px' }}>{feature.icon}</span>
                            <div>
                                <p style={{ color: '#4ade80', fontSize: '13px', fontWeight: 'bold', margin: '0 0 4px' }}>{feature.title}</p>
                                <p style={{ color: '#71717a', fontSize: '12px', margin: '0' }}>{feature.desc}</p>
                            </div>
                        </div>
                    ))}

                    {/* CTA */}
                    <div style={{ textAlign: 'center', margin: '32px 0' }}>
                        <a
                            href="https://stack-mind-ten.vercel.app/dashboard"
                            style={{
                                backgroundColor: '#4ade80',
                                color: '#000',
                                padding: '12px 32px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                display: 'inline-block'
                            }}
                        >
                            Get Started →
                        </a>
                    </div>

                    {/* Footer */}
                    <p style={{ color: '#3f3f46', fontSize: '11px', textAlign: 'center', marginTop: '32px' }}>
                        // Built for developers, by developers — StackMind 2026
                    </p>
                </div>
            </body>
        </html>
    )
}