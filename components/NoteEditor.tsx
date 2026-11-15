'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'

const lowlight = createLowlight(common)

export default function NoteEditor({ content, onChange, readOnly = false }: {
  content: string
  onChange: (content: string) => void
  readOnly?: boolean
}) {
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-label': 'Note content',
        'aria-multiline': 'true',
      },
    },
    extensions: [
      StarterKit.configure({ codeBlock: false, link: { openOnClick: false } }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  useEffect(() => {
    editor?.setEditable(!readOnly, false)
  }, [editor, readOnly])

  return (
    <div className="min-w-0 rounded-lg border border-input-border bg-background p-3 text-foreground focus-within:border-green-500 sm:p-4">
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap gap-2 border-b border-zinc-700 pb-3">
        <button
          type="button"
          aria-label="Bold"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('bold') ? 'bg-green-400 dark:text-black' : 'text-black hover:text-zinc-600 dark:text-gray-400 dark:hover:text-white'}`}
        >
          B
        </button>
        <button
          type="button"
          aria-label="Italic"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('italic') ? 'bg-green-400 dark:text-black' : 'text-black hover:text-zinc-600 dark:text-gray-400 dark:hover:text-white'}`}
        >
          I
        </button>
        <button
          type="button"
          aria-label="Code block"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('codeBlock') ? 'bg-green-400 dark:text-black' : 'text-black hover:text-zinc-600 dark:text-gray-400 dark:hover:text-white'}`}
        >
          {'</>'}
        </button>
        <button
          type="button"
          aria-label="Heading"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-sm ${editor?.isActive('heading') ? 'bg-green-400 dark:text-black' : 'text-black hover:text-zinc-600 dark:text-gray-400 dark:hover:text-white'}`}
        >
          H2
        </button>
      </div>

      {/* Editor */}
      <EditorContent 
        editor={editor} 
        className="note-editor-content"
      />
    </div>
  )
}
