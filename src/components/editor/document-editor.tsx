"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import { EditorToolbar } from "./editor-toolbar";

interface DocumentEditorProps {
  initialContent: string;
  readOnly?: boolean;
  onContentChange: (jsonContent: string) => void;
  onStatsChange?: (stats: { words: number; characters: number }) => void;
}

export function DocumentEditor({
  initialContent,
  readOnly = false,
  onContentChange,
  onStatsChange,
}: DocumentEditorProps) {
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const parsedContent = (() => {
    try {
      if (!initialContent) return "";
      return JSON.parse(initialContent);
    } catch {
      return initialContent;
    }
  })();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: readOnly ? "" : "Start typing here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: parsedContent,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[600px] text-foreground leading-relaxed selection:bg-[#EAEBE6]",
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const characters = text.length;

      if (onStatsChange) {
        onStatsChange({ words, characters });
      }

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        const json = JSON.stringify(editor.getJSON());
        onContentChange(json);
      }, 1000);
    },
  });

  useEffect(() => {
    if (editor && onStatsChange) {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      onStatsChange({ words, characters: text.length });
    }
  }, [editor, onStatsChange]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-background">
      <EditorToolbar editor={editor} readOnly={readOnly} />

      {/* Writing Canvas: Clean white surface on subtle background */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-8">
        <div className="min-h-[700px] rounded-lg border border-border bg-surface p-8 sm:p-14 shadow-xs">
          <EditorContent editor={editor} />
        </div>
      </div>

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9c9f99;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 1.75rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.25;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          color: var(--foreground);
        }
        .ProseMirror h2 {
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: -0.015em;
          line-height: 1.3;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }
        .ProseMirror h3 {
          font-size: 1.15rem;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }
        .ProseMirror p {
          margin-top: 0.6rem;
          margin-bottom: 0.6rem;
          line-height: 1.7;
          color: var(--foreground);
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin: 0.6rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin: 0.6rem 0;
        }
        .ProseMirror li {
          margin: 0.2rem 0;
          line-height: 1.6;
        }
        .ProseMirror blockquote {
          border-left: 3px solid var(--primary);
          padding-left: 1rem;
          color: var(--foreground-secondary);
          font-style: italic;
          margin: 1rem 0;
        }
        .ProseMirror hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
}
