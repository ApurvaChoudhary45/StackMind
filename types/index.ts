
// This file defines the "shape" of all data in our app.

// So it is a contract and every file agrees on what data looks like.

// ─── Document ───────────────────────────────────────────────

// ─── Vector Point ────────────────────────────────────────────
// What we actually store in Qdrant
// = the chunk's text converted to numbers + metadata
export interface VectorPoint {
  id: string
  vector: number[]      // the embedding [0.2, 0.8, 0.1, ...] 
  payload: {            // original data stored alongside the vector
    noteId: string
    title: string
    content: string     // original text (so we can return it)
    projectId: number
    userId: number
  }
}

// ─── Search Result ───────────────────────────────────────────
// What Qdrant returns when we search
export interface SearchResult {
  noteId: string       // the chunk text
  title: string 
  content: string
  projectId : string // which document it came from
  score: number         // similarity score (0 to 1)
}

// ─── Chat Message ────────────────────────────────────────────
// One message in the chat UI
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: SearchResult[]  // citations shown under assistant messages
  createdAt: Date
}

// ─── API Response shapes ─────────────────────────────────────
export interface UploadResponse {
  success: boolean
  documentId: string
  documentName: string
  chunkCount: number
  message: string
}

export interface ChatRequest {
  message: string
  documentId?: string   // optional — search specific doc or all docs
}