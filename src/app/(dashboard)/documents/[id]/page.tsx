"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Check,
  Loader2,
  AlertCircle,
  Download,
  FileText,
  Lock,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentEditor } from "@/components/editor/document-editor";
import { ShareModal } from "@/components/sharing/share-modal";

interface DocumentData {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  userPermission: "OWNER" | "EDITOR" | "VIEWER";
  owner: {
    id: string;
    name: string;
    email: string;
  };
  permissions: {
    canEdit: boolean;
    canShare: boolean;
    canDelete: boolean;
    isOwner: boolean;
  };
}

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export default function DocumentDetailPage() {
  const params = useParams();
  const documentId = params?.id as string;
  const { data: session, status: sessionStatus } = useSession();

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [stats, setStats] = useState({ words: 0, characters: 0 });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const titleDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const currentUserIdRef = useRef<string | undefined>(session?.user?.id);

  const fetchDocument = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        if (res.status === 404 || res.status === 403) {
          setError("Document not found or you do not have permission to view it.");
        } else if (res.status === 401) {
          setError("Your session has expired. Please sign in again.");
        } else {
          setError("Failed to load document.");
        }
        setDocument(null);
        return;
      }
      const data: DocumentData = await res.json();
      setDocument(data);
      setTitle(data.title);
    } catch {
      setError("An unexpected error occurred while loading document.");
      setDocument(null);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  // Initial fetch and fetch when documentId changes
  useEffect(() => {
    if (documentId) {
      fetchDocument();
    }
  }, [documentId, fetchDocument]);

  // Cross-tab and session-switch synchronization:
  // When user logs out or switches accounts in another tab, immediately re-verify access
  useEffect(() => {
    const activeUserId = session?.user?.id;
    if (currentUserIdRef.current !== activeUserId) {
      currentUserIdRef.current = activeUserId;
      if (documentId) {
        fetchDocument();
      }
    }
  }, [session?.user?.id, documentId, fetchDocument]);

  // Also listen to window focus / visibility change to catch background tab changes immediately
  useEffect(() => {
    const handleFocus = () => {
      if (documentId) {
        fetchDocument();
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("visibilitychange", () => {
      if (!window.document.hidden) {
        handleFocus();
      }
    });

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [documentId, fetchDocument]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!document?.permissions.canEdit) return;

    setSaveStatus("unsaved");

    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current);
    }

    titleDebounceRef.current = setTimeout(async () => {
      saveDocument({ title: newTitle.trim() || "Untitled document" });
    }, 800);
  };

  const handleContentChange = (jsonContent: string) => {
    if (!document?.permissions.canEdit) return;
    saveDocument({ content: jsonContent });
  };

  const saveDocument = async (updateData: { title?: string; content?: string }) => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403 || res.status === 404) {
          // Access credentials changed; immediately trigger full document re-verification
          fetchDocument();
        }
        throw new Error("Save request failed");
      }

      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  };

  const handleExport = (format: "md" | "txt") => {
    if (!document) return;

    let textContent = "";
    try {
      const parsed = JSON.parse(document.content);
      const extractText = (node: any): string => {
        if (node.type === "text") return node.text || "";
        if (node.type === "heading") {
          const prefix = "#".repeat(node.attrs?.level || 1) + " ";
          return prefix + (node.content?.map(extractText).join("") || "") + "\n\n";
        }
        if (node.type === "paragraph") {
          return (node.content?.map(extractText).join("") || "") + "\n\n";
        }
        if (node.type === "listItem") {
          return "- " + (node.content?.map(extractText).join("") || "") + "\n";
        }
        if (node.content) {
          return node.content.map(extractText).join("");
        }
        return "";
      };
      textContent = extractText(parsed);
    } catch {
      textContent = document.content;
    }

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${title || "document"}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="text-xs text-foreground-secondary">Opening document...</span>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24 text-center space-y-4">
        <div className="flex h-9 w-9 items-center justify-center rounded bg-[#FAECEB] text-danger mx-auto">
          <AlertCircle className="h-5 w-5" />
        </div>
        <h2 className="text-base font-semibold text-foreground">Unable to open document</h2>
        <p className="text-xs text-foreground-secondary">{error}</p>
        <Link href="/dashboard" className="inline-block pt-2">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to workspace
          </Button>
        </Link>
      </div>
    );
  }

  const isOwner = document.permissions.isOwner;
  const canEdit = document.permissions.canEdit;
  const isViewer = !canEdit;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* 1. Compact Distraction-Free Header Bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface px-4 sm:px-6 shadow-xs">
        {/* Left: Back Link, Doc Icon & Inline Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
          <Link
            href="/dashboard"
            className="flex h-7 w-7 items-center justify-center rounded text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors shrink-0"
            title="Back to workspace"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <FileText className="h-3.5 w-3.5 text-primary shrink-0" />

          <div className="flex items-center gap-3 min-w-0 flex-1 max-w-lg">
            <input
              type="text"
              value={title}
              disabled={isViewer}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled document"
              className={`bg-transparent text-sm font-semibold text-foreground truncate focus:outline-none focus:ring-1 focus:ring-primary rounded px-1.5 py-0.5 transition-colors ${
                isViewer ? "cursor-default text-foreground-secondary" : "hover:bg-surface-secondary focus:bg-surface"
              }`}
            />

            {/* Subtle Save Status */}
            <div className="hidden sm:flex items-center text-[11px] text-foreground-secondary/70 shrink-0">
              {saveStatus === "saving" && (
                <span className="flex items-center gap-1 text-foreground-secondary">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  Saving...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="flex items-center gap-1 text-success font-medium">
                  <Check className="h-3 w-3" />
                  Saved.
                </span>
              )}
              {saveStatus === "unsaved" && (
                <span className="text-foreground-secondary">Unsaved</span>
              )}
              {saveStatus === "error" && (
                <span className="text-danger font-medium">Unable to save.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Export, Share, User Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Permission Label */}
          {isOwner ? (
            <Badge variant="owner" className="hidden sm:inline-flex">Owner</Badge>
          ) : document.userPermission === "EDITOR" ? (
            <Badge variant="editor" className="hidden sm:inline-flex">Can edit</Badge>
          ) : (
            <Badge variant="viewer" className="hidden sm:inline-flex">Read only</Badge>
          )}

          {/* Export Dropdown */}
          <div className="relative group">
            <Button variant="outline" size="sm" className="gap-1 h-7 text-xs">
              <Download className="h-3 w-3 text-foreground-secondary" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <div className="absolute right-0 top-8 hidden group-hover:block group-focus-within:block w-36 rounded-md border border-border bg-surface py-1 shadow-md z-50 text-xs">
              <button
                onClick={() => handleExport("md")}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-foreground hover:bg-surface-secondary"
              >
                Markdown (.md)
              </button>
              <button
                onClick={() => handleExport("txt")}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-foreground hover:bg-surface-secondary"
              >
                Plain Text (.txt)
              </button>
            </div>
          </div>

          {/* Share Button (Owner only) */}
          {isOwner && (
            <Button
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
              className="gap-1.5 h-7 text-xs font-medium"
            >
              <Share2 className="h-3 w-3" />
              Share
            </Button>
          )}

          {isViewer && (
            <div className="flex items-center gap-1 rounded bg-surface-secondary px-2 py-0.5 text-[11px] text-foreground-secondary border border-border">
              <Lock className="h-3 w-3" />
              <span className="hidden sm:inline">Viewing only</span>
            </div>
          )}

          {/* User Profile Avatar with Hover/Click Dropdown */}
          <div className="relative group ml-1">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAEBE6] text-primary font-bold text-xs shrink-0 transition-opacity hover:opacity-85 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              title={session?.user?.name || "User profile"}
            >
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </button>

            {/* Dropdown Menu (revealed on hover and focus-within) */}
            <div className="absolute right-0 top-8 hidden group-hover:block group-focus-within:block w-48 rounded-md border border-border bg-surface py-1.5 shadow-md z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-border">
                <p className="font-medium text-foreground truncate">
                  {session?.user?.name || "Demo User"}
                </p>
                <p className="text-[11px] text-foreground-secondary truncate">
                  {session?.user?.email || ""}
                </p>
              </div>

              <Link
                href="/dashboard"
                className="flex w-full items-center gap-2 px-3 py-1.5 text-foreground hover:bg-surface-secondary transition-colors"
              >
                <User className="h-3.5 w-3.5 text-foreground-secondary" />
                <span>Workspace Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-danger hover:bg-[#FAECEB] transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Document Writing Canvas */}
      <DocumentEditor
        initialContent={document.content}
        readOnly={isViewer}
        onContentChange={handleContentChange}
        onStatsChange={setStats}
      />

      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          documentId={document.id}
          documentTitle={document.title}
          onUnauthorized={() => {
            setIsShareModalOpen(false);
            fetchDocument();
          }}
        />
      )}
    </div>
  );
}
