import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({ html: false, breaks: true })

export default function BugRecommendation({ content }: { content: string }) {
    return (
        <div
            className="bug-recommendation text-sm leading-7 text-foreground"
            dangerouslySetInnerHTML={{ __html: markdown.render(content) }}
        />
    )
}
