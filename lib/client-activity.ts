export const clientActivityEvents = {
    signed_in: { action: 'signed_in', type: 'account', title: 'Signed in to StackMind' },
    signed_out: { action: 'requested', type: 'account', title: 'Sign out of StackMind' },
    settings_saved: { action: 'saved', type: 'settings', title: 'Workspace preferences' },
    theme_changed: { action: 'updated', type: 'settings', title: 'Appearance' },
    snippet_copied: { action: 'copied', type: 'snippet', title: 'Copied snippet code' },
    token_copied: { action: 'copied', type: 'account', title: 'Copied API token' },
    file_copied: { action: 'copied', type: 'github', title: 'Copied repository file' },
} as const

export async function trackActivity(event: keyof typeof clientActivityEvents) {
    try {
        await fetch('/api/activity', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event }), keepalive: true, signal: AbortSignal.timeout(5000),
        })
    } catch {
        // Activity recording must not interrupt the user's original action.
    }
}
