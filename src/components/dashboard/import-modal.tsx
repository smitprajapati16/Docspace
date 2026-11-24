"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import mammoth from "mammoth";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateAndSetFile = (file: File) => {
    setError(null);
    const validExtensions = [".txt", ".md", ".docx", ".json"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validExtensions.includes(ext)) {
      setError(`Unsupported format (${ext}). Supported: .txt, .md, .docx, .json`);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File exceeds 2 MB limit.");
      return;
    }

    if (file.size === 0) {
      setError("File is empty.");
      return;
    }

    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const ext = "." + selectedFile.name.split(".").pop()?.toLowerCase();
      let docTitle = selectedFile.name.replace(/\.[^/.]+$/, "");
      let tiptapContent: any;

      if (ext === ".txt") {
        const text = await selectedFile.text();
        const paragraphs = text.split("\n\n").map((p) => ({
          type: "paragraph",
          content: p.trim() ? [{ type: "text", text: p.trim() }] : [],
        }));
        tiptapContent = {
          type: "doc",
          content: paragraphs.length > 0 ? paragraphs : [{ type: "paragraph", content: [] }],
        };
      } else if (ext === ".md") {
        const markdown = await selectedFile.text();
        const lines = markdown.split("\n");
        const nodes: any[] = [];

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("# ")) {
            nodes.push({
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: trimmed.slice(2) }],
            });
          } else if (trimmed.startsWith("## ")) {
            nodes.push({
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: trimmed.slice(3) }],
            });
          } else if (trimmed.startsWith("### ")) {
            nodes.push({
              type: "heading",
              attrs: { level: 3 },
              content: [{ type: "text", text: trimmed.slice(4) }],
            });
          } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            nodes.push({
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: trimmed.slice(2) }],
                    },
                  ],
                },
              ],
            });
          } else {
            nodes.push({
              type: "paragraph",
              content: [{ type: "text", text: trimmed }],
            });
          }
        }

        tiptapContent = {
          type: "doc",
          content: nodes.length > 0 ? nodes : [{ type: "paragraph", content: [] }],
        };
      } else if (ext === ".docx") {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const rawText = result.value;
        const paragraphs = rawText.split("\n").filter((p) => p.trim()).map((p) => ({
          type: "paragraph",
          content: [{ type: "text", text: p.trim() }],
        }));
        tiptapContent = {
          type: "doc",
          content: paragraphs.length > 0 ? paragraphs : [{ type: "paragraph", content: [] }],
        };
      } else if (ext === ".json") {
        const text = await selectedFile.text();
        const parsed = JSON.parse(text);
        if (parsed.type === "doc" && Array.isArray(parsed.content)) {
          tiptapContent = parsed;
        } else {
          throw new Error("Invalid Tiptap schema");
        }
      }

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: docTitle,
          content: JSON.stringify(tiptapContent),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create imported document");
      }

      const createdDoc = await res.json();
      onClose();
      router.push(`/documents/${createdDoc.id}`);
    } catch (err: any) {
      setError(err?.message || "Failed to import file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-lg border border-border bg-surface p-5 shadow-xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold text-foreground">Import document</h2>
            <p className="text-xs text-foreground-secondary">
              Upload a .txt, .md, .docx, or .json file (max 2 MB)
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="rounded border border-red-200 bg-[#FAECEB] p-2 text-[11px] text-danger font-medium flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="rounded border border-dashed border-border bg-background p-6 text-center cursor-pointer hover:bg-surface-secondary transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.docx,.json"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                validateAndSetFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />
          <Upload className="h-5 w-5 text-foreground-secondary mx-auto mb-2" />
          <p className="text-xs font-medium text-foreground">Click to choose a file</p>
          <p className="text-[10px] text-foreground-secondary mt-0.5">.md, .docx, .txt, .json</p>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between rounded border border-border bg-surface-secondary px-3 py-2 text-xs">
            <div className="flex items-center gap-2 truncate pr-2">
              <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-medium text-foreground truncate">{selectedFile.name}</span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-foreground-secondary hover:text-danger"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading} className="h-7 text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleImport}
            disabled={!selectedFile}
            isLoading={loading}
            className="h-7 text-xs font-medium"
          >
            Import
          </Button>
        </div>
      </div>
    </div>
  );
}
