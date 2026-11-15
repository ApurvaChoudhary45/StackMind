
import { QdrantClient } from "@qdrant/js-client-rest";

import { createAdminClient } from '@/lib/supabase/admin'
import { VectorPoint, SearchResult } from "../types";

// This how we connect to Qadrant

const client = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY,
})


const COLLECTION_NAME = 'StackMind'

const VECTOR_SIZE = 512

export async function setupCollection(): Promise<void> {
    try {
        const collection = await client.getCollections()

        const exists = collection.collections.some(
            col => col.name === COLLECTION_NAME
        )
        if (exists) {
            console.log(`✅ Collection "${COLLECTION_NAME}" already exists`)
            await createPayloadIndexes()
            return
        }

        await client.createCollection(COLLECTION_NAME, {
            vectors: {
                size: VECTOR_SIZE,  // Vector size that you have taken must match the embedding model output or else Qdrant will decline our vetors
                distance: "Cosine",
            }
        })

        console.log(`🎉 Created collection "${COLLECTION_NAME}"`)
        console.log(`   Vector size: ${VECTOR_SIZE}`)
        console.log(`   Distance metric: Cosine similarity`)

        await createPayloadIndexes()

    } catch (error) {
        console.error('Failed to setup Qdrant collection:', error)
        throw error
    }
}

// ─── Create Payload Indexes ───────────────────────────────────
// Qdrant needs explicit indexes on fields we filter by.
// Without this, filtering by userId throws a 400 error.
// Same concept as CREATE INDEX in SQL.
async function createPayloadIndexes(): Promise<void> {
    try {
        // Index on userId — used to filter search to one document
        await client.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'userId',
            field_schema: 'keyword',  // keyword = exact string match
        })
        console.log('✅ Payload index created for userId')

    } catch (error: any) {
        // If index already exists Qdrant throws an error
        // We can safely ignore that specific error
        if (error?.data?.status?.error?.includes('already exists')) {
            console.log('✅ Payload indexes already exist')
        } else {
            console.error('Failed to create payload indexes:', error)
        }
    }
}

export async function storeVectors(points: VectorPoint[]): Promise<void> {

    try {
        console.log(`💾 Storing ${points.length} vectors in Qdrant...`)

        // Qdrant expects points in a specific format
        // We map our VectorPoint type to match exactly what Qdrant wants

        const qdrantPoints = points.map(point => ({

            id: point.id,
            vector: point.vector,
            payload: point.payload

        }))

        // upsert = insert or update (meaning if point is not there insert it else update the existing one)

        await client.upsert(COLLECTION_NAME, {
            wait: true,
            points: qdrantPoints
        })

        console.log(`✅ Successfully stored ${points.length} vectors`)

    } catch (error) {
        console.error('Failed to store vectors:', error)
        throw error
    }

}

// Step 3 Searching in the vector DB (heart of RAG)

export async function searchVectors(
    queryVector: number[],      // embedText(userQuestion) result
    topK: number,           // how many results to return
    userId: string,
    includeSnippets = false
): Promise<SearchResult[]> {
    try {

        const searchOptions: any = {
            vector: queryVector,
            limit: topK,
            with_payload: true, //
            score_threshold: 0.3 // So here the threshold is 0.3 anything below this would be  irrelevant 
        }

        searchOptions.filter = {
            must: [{ key: 'userId', match: { value: userId } }],
        }
        console.log(`   Filtering to document: ${userId}`)

        const results = await client.search(COLLECTION_NAME, searchOptions)

        console.log(`✅ Found ${results.length} relevant chunks`)

        // Now Transform Qdrant results into our SearchResult type

        const ids = results.map(result => String(result.id))
        if (ids.length === 0) return []

        const supabase = createAdminClient()
        const notesResult = await supabase.from('notes')
            .select('id, title, content, project_id')
            .eq('user_id', userId)
            .in('id', ids)
        if (notesResult.error) throw notesResult.error
        const documents = notesResult.data

        if (includeSnippets) {
            const snippetsResult = await supabase.from('snippets')
                .select('id, title, code, project_id')
                .eq('user_id', userId)
                .in('id', ids)
            if (snippetsResult.error) throw snippetsResult.error
            documents.push(...snippetsResult.data.map(({ code, ...snippet }) => ({
                ...snippet,
                content: code,
            })))
        }

        const byId = new Map(documents.map(document => [document.id, document]))
        return results.flatMap(result => {
            const document = byId.get(String(result.id))
            if (!document) return []
            return [{
                noteId: document.id,
                title: document.title,
                content: document.content,
                projectId: document.project_id,
                score: result.score,
            }]
        })


    } catch (error) {
        console.error('Search failed:', error)
        throw error
    }
}

// ─── Delete Document Vectors ──────────────────────────────────
// When a user deletes a document, remove all its vectors from Qdrant.

export async function deleteDocumentVectors(noteId: string): Promise<void> {
    try {
        await client.delete(COLLECTION_NAME, {
            wait: true,
            points: [noteId],
        })
    } catch (error) {
        console.error('Failed to delete vectors:', error)
        throw error
    }
}

// If you want to get the collection information 

export async function getCollectionStats() {
    try {
        const info = await client.getCollection(COLLECTION_NAME)

        return {
            totalPoints: info.points_count,    // total chunks stored
            vectorSize: VECTOR_SIZE,
            collectionName: COLLECTION_NAME,
        }
    } catch {
        return null
    }
}