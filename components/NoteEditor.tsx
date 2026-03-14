'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'

const lowlight = createLowlight(common)

export default function NoteEditor({ content, onChange }: { 
  content: string, 
  onChange: (content: string) => void 
}) {
  const editor = useEditor({
     immediatelyRender: false, 
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  return (
    <div className="border border-zinc-700 rounded-lg p-4 min-h-64 text-white">
      {/* Toolbar */}
      <div className="flex gap-2 mb-3 border-b border-zinc-700 pb-3">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('bold') ? 'bg-green-400 text-black' : 'text-gray-400 hover:text-white'}`}
        >
          B
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('italic') ? 'bg-green-400 text-black' : 'text-gray-400 hover:text-white'}`}
        >
          I
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('codeBlock') ? 'bg-green-400 text-black' : 'text-gray-400 hover:text-white'}`}
        >
          {'</>'}
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('heading') ? 'bg-green-400 text-black' : 'text-gray-400 hover:text-white'}`}
        >
          H2
        </button>
      </div>

      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className="prose prose-invert max-w-none focus:outline-none"
      />
    </div>
  )
}