"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
  onUnauthorized?: () => void;
}

interface ShareItem {
  id: string;
  userId: string;
  permission: "VIEWER" | "EDITOR";
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function ShareModal({ isOpen, onClose, documentId, documentTitle, onUnauthorized }: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"VIEWER" | "EDITOR">("EDITOR");
  const [shares, setShares] = useState<ShareItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadShares = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/documents/${documentId}/share`);
      if (res.ok) {
        const data = await res.json();
        setShares(data);
      } else if (res.status === 401 || res.status === 403) {
        onUnauthorized?.();
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  }, [documentId, onUnauthorized]);

  useEffect(() => {
    if (isOpen && documentId) {
      loadShares();
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, documentId, loadShares]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setSuccess(null);
    setSharing(true);

    try {
      const res = await fetch(`/api/documents/${documentId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), permission }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to share document");
        if (res.status === 401 || res.status === 403) {
          onUnauthorized?.();
        }
      } else {
        setSuccess(`Access granted to ${email}`);
        setEmail("");
        loadShares();
      }
    } catch {
      setError("An unexpected error occurred while sharing.");
    } finally {
      setSharing(false);
    }
  };

  const handleRemoveShare = async (userId: string) => {
    try {
      const res = await fetch(`/api/documents/${documentId}/share?userId=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setShares((prev) => prev.filter((s) => s.userId !== userId));
        setSuccess("Access removed");
      }
    } catch {
      setError("Failed to remove access");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold text-foreground">Share document</h2>
            <p className="text-xs text-foreground-secondary truncate max-w-xs">
              {documentTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Share Form */}
        <form onSubmit={handleShare} className="space-y-3">
          {error && (
            <div className="rounded border border-red-200 bg-[#FAECEB] p-2 text-[11px] text-danger font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded border border-emerald-200 bg-[#EBF3EE] p-2 text-[11px] text-success font-medium flex items-center gap-1.5">
              <Check className="h-3 w-3" />
              {success}
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="collaborator@docspace.demo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as "VIEWER" | "EDITOR")}
              aria-label="Permission role"
              className="h-8 rounded-md border border-border bg-surface px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="EDITOR">Can edit</option>
              <option value="VIEWER">Viewer</option>
            </select>
            <Button type="submit" size="sm" isLoading={sharing} className="h-8 text-xs">
              Invite
            </Button>
          </div>
        </form>

        {/* Collaborators List */}
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-secondary/70">
            People with access ({shares.length})
          </span>

          {loading ? (
            <p className="py-4 text-center text-xs text-foreground-secondary">Loading...</p>
          ) : shares.length === 0 ? (
            <p className="py-4 text-center text-xs text-foreground-secondary">
              Only you have access to this document.
            </p>
          ) : (
            <div className="divide-y divide-border/60 max-h-48 overflow-y-auto">
              {shares.map((share) => (
                <div key={share.id} className="flex items-center justify-between py-2 text-xs">
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAEBE6] text-[11px] font-bold text-primary shrink-0">
                      {share.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <p className="font-medium text-foreground truncate">{share.user.name}</p>
                      <p className="text-[10px] text-foreground-secondary truncate">{share.user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={share.permission === "EDITOR" ? "editor" : "viewer"}>
                      {share.permission === "EDITOR" ? "Can edit" : "Viewer"}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleRemoveShare(share.userId)}
                      title="Remove access"
                      className="rounded p-1 text-foreground-secondary hover:text-danger hover:bg-surface-secondary transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} className="h-7 text-xs">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
