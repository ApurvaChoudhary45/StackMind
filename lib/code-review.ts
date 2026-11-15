import { z } from 'zod'

const reviewSchema = z.object({
    items: z.array(z.object({
        type: z.enum(['error', 'warning', 'suggestion']),
        title: z.string(),
        description: z.string(),
    })),
    score: z.number().min(0).max(100),
})


export function parseCodeReview(text: string) {
    try {
        const json: unknown = JSON.parse(text.replace(/```json|```/gi, '').trim())
        const review = reviewSchema.safeParse(json)
        return review.success ? review.data : null
    } catch {
        return null
    }
}
