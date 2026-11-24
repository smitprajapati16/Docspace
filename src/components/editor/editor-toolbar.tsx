"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Minus,
  Pilcrow,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  readOnly?: boolean;
}

export function EditorToolbar({ editor, readOnly }: EditorToolbarProps) {
  if (!editor || readOnly) {
    return null;
  }

  return (
    <div className="sticky top-14 z-30 flex items-center justify-center border-b border-border bg-surface/90 px-4 py-1.5 backdrop-blur-xs">
      <div className="flex items-center gap-1 overflow-x-auto max-w-2xl w-full">
        {/* Group 1: Undo / Redo */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-border shrink-0">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="flex h-7 w-7 items-center justify-center rounded text-foreground-secondary hover:bg-surface-secondary hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="flex h-7 w-7 items-center justify-center rounded text-foreground-secondary hover:bg-surface-secondary hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Group 2: Headings & Paragraph */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-border shrink-0">
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
              editor.isActive("paragraph")
                ? "bg-surface-secondary text-foreground font-semibold"
                : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            }`}
            title="Paragraph"
          >
            <Pilcrow className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
              editor.isActive("heading", { level: 1 })
                ? "bg-surface-secondary text-foreground font-semibold"
                : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            }`}
            title="Heading 1"
          >
            <Heading1 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "bg-surface-secondary text-foreground font-semibold"
                : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            }`}
            title="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
              editor.isActive("heading", { level: 3 })
                ? "bg-surface-secondary text-foreground font-semibold"
                : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            }`}
            title="Heading 3"
          >
            <Heading3 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Group 3: Bold / Italic / Underline */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-border shrink-0">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
              editor.isActive("bold")
                ? "bg-surface-secondary text-foreground font-bold"
                : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
              editor.isActive("italic")
                ? "bg-surface-secondary text-foreground font-semibold"
                : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
              editor.isActive("underline")
                ? "bg-surface-secondary text-foreground font-semibold"
                : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            }`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Group 4: Lists, Quotes & Dividers */}
        <div className="flex items-center gap-0.5 pl-1.5 shrink-0">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
              editor.isActive("bulletList")
                ? "bg-surface-secondary text-foreground font-semibold"
                : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            }`}
            title="Bulleted list"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
              editor.isActive("orderedList")
                ? "bg-surface-secondary text-foreground font-semibold"
                : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            }`}
            title="Numbered list"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors ${
              editor.isActive("blockquote")
                ? "bg-surface-secondary text-foreground font-semibold"
                : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
            }`}
            title="Blockquote"
          >
            <Quote className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="flex h-7 w-7 items-center justify-center rounded text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
            title="Horizontal divider"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
