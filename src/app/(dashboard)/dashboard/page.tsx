"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Upload,
  Search,
  FileText,
  AlertCircle,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DocumentRow } from "@/components/dashboard/document-row";
import { ImportModal } from "@/components/dashboard/import-modal";
import { ShareModal } from "@/components/sharing/share-modal";
import { AppSidebar } from "@/components/layout/app-sidebar";

interface DocumentData {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  userPermission?: "OWNER" | "EDITOR" | "VIEWER";
}

function DashboardContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<{
    owned: DocumentData[];
    shared: DocumentData[];
    all: DocumentData[];
  }>({
    owned: [],
    shared: [],
    all: [],
  });
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sharing state
  const [shareDoc, setShareDoc] = useState<{ id: string; title: string } | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled document" }),
      });
      if (res.ok) {
        const doc = await res.json();
        router.push(`/documents/${doc.id}`);
      }
    } catch (err) {
      console.error("Creation failed", err);
      setIsCreating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/documents/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDocuments((prev) => ({
          owned: prev.owned.filter((d) => d.id !== deleteTarget.id),
          shared: prev.shared.filter((d) => d.id !== deleteTarget.id),
          all: prev.all.filter((d) => d.id !== deleteTarget.id),
        }));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter based on active tab and search query
  const getDisplayDocuments = () => {
    let list: DocumentData[] = [];
    if (activeTab === "all") list = documents.all;
    if (activeTab === "owned") list = documents.owned;
    if (activeTab === "shared") list = documents.shared;

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase().trim();
    return list.filter((doc) => doc.title.toLowerCase().includes(query));
  };

  const displayList = getDisplayDocuments();

  return (
    <div className="flex min-h-screen bg-background">
      {/* 1. Persistent Desktop Sidebar & Collapsible Mobile Sidebar */}
      <AppSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onCreateDocument={handleCreateDocument}
        isCreating={isCreating}
      />

      {/* 2. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex h-14 items-center justify-between border-b border-border bg-surface px-4">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="rounded p-1.5 text-foreground-secondary hover:bg-surface-secondary"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold text-foreground">DocSpace</span>
          <Button
            size="sm"
            onClick={handleCreateDocument}
            isLoading={isCreating}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            New
          </Button>
        </header>

        {/* Workspace Content */}
        <main className="flex-1 p-6 sm:p-10 max-w-5xl w-full mx-auto space-y-6">
          {/* Header Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Your workspace
              </h1>
              <p className="text-xs text-foreground-secondary">
                Manage your documents and shared work.
              </p>
            </div>

            {/* Right Controls: Search & Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-60">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-foreground-secondary/60" />
                <Input
                  placeholder="Search documents..."
                  className="pl-8 h-8 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportOpen(true)}
                className="gap-1.5 h-8"
              >
                <Upload className="h-3.5 w-3.5 text-foreground-secondary" />
                <span className="hidden sm:inline">Import</span>
              </Button>

              <Button
                size="sm"
                onClick={handleCreateDocument}
                isLoading={isCreating}
                className="gap-1.5 h-8 font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New document</span>
              </Button>
            </div>
          </div>

          {/* Document Organization (Refined List / Table) */}
          <div className="rounded-lg border border-border bg-surface shadow-xs">
            {/* Table Header Row */}
            <div className="flex items-center justify-between py-2 px-3 bg-[#FAFBF9] border-b border-border text-[11px] font-medium text-foreground-secondary uppercase tracking-wider select-none rounded-t-lg">
              <div className="flex-1 pr-4">Document</div>
              <div className="hidden sm:block w-32">Owner</div>
              <div className="hidden md:block w-28">Last modified</div>
              <div className="w-20 text-right sm:text-left">Access</div>
              <div className="w-8 text-right"></div>
            </div>

            {/* Loading / Rows / Minimal Empty State */}
            {loading ? (
              <div className="divide-y divide-border/60">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 animate-pulse">
                    <div className="flex items-center gap-2.5 flex-1">
                      <div className="h-4 w-4 bg-[#EAEBE6] rounded" />
                      <div className="h-3 w-48 bg-[#EAEBE6] rounded" />
                    </div>
                    <div className="h-3 w-16 bg-[#EAEBE6] rounded" />
                  </div>
                ))}
              </div>
            ) : displayList.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-surface-secondary text-foreground-secondary mx-auto">
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Nothing here yet.</h3>
                <p className="text-xs text-foreground-secondary max-w-xs mx-auto">
                  {searchQuery
                    ? `No documents found matching "${searchQuery}".`
                    : activeTab === "shared"
                    ? "No documents have been shared with your account yet."
                    : "Create a document or import an existing file to get started."}
                </p>
                {!searchQuery && activeTab !== "shared" && (
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <Button size="sm" onClick={handleCreateDocument} isLoading={isCreating}>
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      New document
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
                      <Upload className="mr-1 h-3.5 w-3.5" />
                      Import file
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {displayList.map((doc, index) => (
                  <DocumentRow
                    key={doc.id}
                    id={doc.id}
                    title={doc.title}
                    updatedAt={doc.updatedAt}
                    ownerId={doc.ownerId}
                    currentUserId={session?.user?.id || ""}
                    owner={doc.owner}
                    userPermission={doc.userPermission}
                    isLastRow={index >= displayList.length - 2}
                    onDelete={(id, title) => setDeleteTarget({ id, title })}
                    onShare={(id, title) => setShareDoc({ id, title })}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Share Modal */}
      {shareDoc && (
        <ShareModal
          isOpen={!!shareDoc}
          onClose={() => setShareDoc(null)}
          documentId={shareDoc.id}
          documentTitle={shareDoc.title}
        />
      )}

      {/* Import Modal */}
      <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-5 shadow-lg space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#FAECEB] text-danger shrink-0">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">Delete document</h3>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  Are you sure you want to delete &ldquo;
                  <span className="font-medium text-foreground">{deleteTarget.title}</span>
                  &rdquo;? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteConfirm}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <span className="text-xs text-foreground-secondary">Loading workspace...</span>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
