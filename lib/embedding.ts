
import { VoyageAIClient } from 'voyageai'


const voyage = new VoyageAIClient({
    apiKey: process.env.VOYAGE_API_KEY || 'mock-key'
})

const EMBEDDING_MODEL = 'voyage-3-lite'


export async function embedText(text: string): Promise<number[]> {
    if (!process.env.VOYAGE_API_KEY || process.env.VOYAGE_API_KEY === 'mock-key') {
        console.log('⚠️  Using mock embedding (no VoyageAI key found)')
        return new Array(1024).fill(0) //

    }

    try {
        const response = await voyage.embed({
            input: text,   // Text need to be converted to vector form
            model: EMBEDDING_MODEL  // Model being used
        })

        if (!response.data || response.data.length === 0) { // Null checker
            throw new Error('No embedding returned from VoyageAI')
        }
        // response.data[0].embedding is the array of numbers

        const vector = response?.data[0]?.embedding as number[]

        console.log(vector)

        return vector

    } catch (error) {
        console.error("Embedding error:", error);
        throw new Error(`Failed to embed text: ${error}`)
    }

}



