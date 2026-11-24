"use client";

import Link from "next/link";
import { FileText, MoreVertical, Trash2, Share2, Clock, User, Eye, Edit3 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

export interface DocumentCardProps {
  id: string;
  title: string;
  updatedAt: string | Date;
  ownerId: string;
  currentUserId: string;
  owner: {
    name: string;
    email: string;
  };
  userPermission?: "OWNER" | "EDITOR" | "VIEWER";
  onDelete?: (id: string, title: string) => void;
  onShare?: (id: string, title: string) => void;
}

export function DocumentCard({
  id,
  title,
  updatedAt,
  ownerId,
  currentUserId,
  owner,
  userPermission = "OWNER",
  onDelete,
  onShare,
}: DocumentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwner = userPermission === "OWNER" || ownerId === currentUserId;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300">
      {/* Top row: Icon, Badge, and Action dropdown */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <FileText className="h-5 w-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {isOwner ? (
              <Badge variant="owner" className="text-[11px] font-semibold">
                Owner
              </Badge>
            ) : userPermission === "EDITOR" ? (
              <Badge variant="editor" className="text-[11px] font-semibold gap-1">
                <Edit3 className="h-3 w-3" /> Editor
              </Badge>
            ) : (
              <Badge variant="viewer" className="text-[11px] font-semibold gap-1">
                <Eye className="h-3 w-3" /> Viewer
              </Badge>
            )}

            {/* Menu options */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-slate-100 hover:text-foreground"
                title="Document actions"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-9 z-30 w-36 rounded-lg border border-border bg-surface py-1 shadow-lg">
                    <Link
                      href={`/documents/${id}`}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-slate-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Open
                    </Link>

                    {isOwner && onShare && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onShare(id, title);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-slate-100"
                      >
                        <Share2 className="h-3.5 w-3.5 text-primary" />
                        Share
                      </button>
                    )}

                    {isOwner && onDelete && (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onDelete(id, title);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-danger hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <Link href={`/documents/${id}`} className="mt-4 block">
          <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            {title || "Untitled document"}
          </h3>
        </Link>
      </div>

      {/* Card Footer info */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-muted">
        <div className="flex items-center gap-1.5 truncate">
          <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{isOwner ? "You" : owner.name}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
          <Clock className="h-3 w-3" />
          <span>{formatRelativeTime(updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
