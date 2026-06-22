# StackMind — Second Brain for Developers

> Your notes, snippets, and bugs — all in one place. Powered by AI.


[![Live Demo](https://stack-mind-ten.vercel.app/)]

---

## What is StackMind?

StackMind is a developer productivity tool that acts as your second brain. Write notes with rich text and code blocks, track bugs on a Kanban board, save reusable snippets, and ask AI questions grounded in your own notes — all in one place.

---

## Features

### 📝 Notes
- Rich text editor with code block support
- Per-project organization
- Create, edit, and delete notes seamlessly

### 🤖 AI-Powered RAG Search
- Ask questions in natural language — AI answers based on **your own notes**
- Powered by Voyage AI embeddings + Qdrant vector database + Claude Haiku
- User-isolated search — only your notes, never anyone else's
- Vectors stay in sync on every create, edit, and delete

### 🐛 Bug Tracker
- Kanban-style board to track bugs across projects
- Drag and drop support

### 📦 Snippet Library
- Save and organize reusable code snippets
- GitHub import support

### 🌙 Dark / Light Mode
- System preference aware
- Persists across sessions

### 🔐 Authentication
- Google OAuth via Supabase Auth
- Secure session management with middleware

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Auth** | Supabase Auth (Google OAuth) |
| **Database** | Supabase (PostgreSQL) |
| **Vector DB** | Qdrant Cloud |
| **Embeddings** | Voyage AI (`voyage-3-lite`) |
| **AI** | Anthropic Claude Haiku |
| **File Storage** | EdgeStore |
| **Deployment** | Vercel |
| **Containerization** | Docker |
| **Cloud** | AWS EC2 |

---

## Architecture

```
User
  │
  ├── Next.js App Router (Vercel)
  │     ├── /api/notes     → Create note + embed to Qdrant
  │     ├── /api/rag       → Semantic search + Claude answer
  │     ├── /api/deletenote → Delete from Supabase + Qdrant
  │     └── /api/editnote  → Update Supabase + re-embed Qdrant
  │
  ├── Supabase (PostgreSQL)
  │     ├── projects
  │     ├── notes
  │     ├── snippets
  │     └── bugs
  │
  ├── Qdrant Cloud (Vector DB)
  │     └── stackmind collection (1024-dim, Cosine similarity)
  │
  └── Anthropic API (Claude Haiku)
```

---

## RAG Pipeline

```
Save Note → Voyage AI embeds title + content → Store in Qdrant with userId
                                                        │
Ask Question → Embed query → Search Qdrant (filtered by userId)
                                      │
                          Top 5 similar notes retrieved
                                      │
                    Claude Haiku generates answer with notes as context
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Qdrant Cloud account
- Voyage AI API key
- Anthropic API key
- Google OAuth credentials
- EdgeStore account

### Installation

```bash
git clone https://github.com/yourusername/stackmind.git
cd stackmind
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

ANTHROPIC_API_KEY=your_anthropic_key

VOYAGE_API_KEY=your_voyage_key

QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

EDGE_STORE_ACCESS_KEY=your_edgestore_access_key
EDGE_STORE_SECRET_KEY=your_edgestore_secret_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Docker Deployment

### Build the image

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=your_value \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value \
  -t stackmind .
```

### Run the container

```bash
docker run -d -p 3000:3000 \
  -e ANTHROPIC_API_KEY=your_value \
  -e VOYAGE_API_KEY=your_value \
  -e QDRANT_URL=your_value \
  -e QDRANT_API_KEY=your_value \
  -e GOOGLE_CLIENT_ID=your_value \
  -e GOOGLE_CLIENT_SECRET=your_value \
  -e EDGE_STORE_ACCESS_KEY=your_value \
  -e EDGE_STORE_SECRET_KEY=your_value \
  stackmind
```

---

## AWS EC2 Deployment

```bash
# On your EC2 instance
docker pull yourdockerhubusername/stackmind:v1
docker run -d -p 3000:3000 -e ... yourdockerhubusername/stackmind:v1
```

Make sure port 3000 is open in your EC2 Security Group inbound rules.

---

## Project Structure

```
stackmind/
├── app/
│   ├── api/
│   │   ├── notes/          # Note CRUD + Qdrant sync
│   │   ├── rag/            # RAG search endpoint
│   │   ├── editnote/       # Edit + re-embed
│   │   └── deletenote/     # Delete + remove vector
│   └── dashboard/
│       └── projects/
│           └── [id]/
│               ├── notes/
│               ├── bugs/
│               └── snippets/
├── components/
│   ├── NoteSection.tsx
│   ├── RagSearch.tsx
│   ├── ThemeToggle.tsx
│   └── ...
├── lib/
│   ├── embeddings.ts       # Voyage AI
│   ├── qdrant.ts           # Qdrant client
│   └── supabase/
├── Dockerfile
└── .dockerignore
```

---

## License

MIT © 2026 — Built with ☕ and way too many late nights.