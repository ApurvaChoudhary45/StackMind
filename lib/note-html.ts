import sanitizeHtml from 'sanitize-html'

export function sanitizeNoteHtml(content: string | null | undefined): string {
    return sanitizeHtml(content ?? '', {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, 's'],
        allowedAttributes: {
            a: ['href', 'title'],
            code: ['class'],
            ol: ['start'],
        },
        allowedClasses: { code: ['language-*'] },
        allowedSchemes: ['http', 'https', 'mailto'],
    })
}
