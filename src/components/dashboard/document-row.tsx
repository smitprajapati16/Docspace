"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, MoreHorizontal, Trash2, Share2, Eye, Edit3 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

export interface DocumentRowProps {
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
  isLastRow?: boolean;
  onDelete?: (id: string, title: string) => void;
  onShare?: (id: string, title: string) => void;
}

export function DocumentRow({
  id,
  title,
  updatedAt,
  ownerId,
  currentUserId,
  owner,
  userPermission = "OWNER",
  isLastRow = false,
  onDelete,
  onShare,
}: DocumentRowProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwner = userPermission === "OWNER" || ownerId === currentUserId;

  const handleRowClick = () => {
    router.push(`/documents/${id}`);
  };

  return (
    <div
      onClick={handleRowClick}
      className="group flex items-center justify-between py-2.5 px-3 border-b border-border/70 text-xs transition-colors hover:bg-surface-secondary/70 cursor-pointer"
    >
      {/* Column 1: Document Icon & Title (Flex 1) */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-4">
        <FileText className="h-4 w-4 text-primary shrink-0 transition-opacity group-hover:opacity-80" />
        <span className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {title || "Untitled document"}
        </span>
      </div>

      {/* Column 2: Owner (Hidden on extra small screens) */}
      <div className="hidden sm:block w-32 truncate text-foreground-secondary text-[11px]">
        {isOwner ? "You" : owner.name}
      </div>

      {/* Column 3: Last Modified */}
      <div className="hidden md:block w-28 text-foreground-secondary text-[11px]">
        {formatRelativeTime(updatedAt)}
      </div>

      {/* Column 4: Access Badge */}
      <div className="w-20 text-right sm:text-left">
        {isOwner ? (
          <Badge variant="owner">Owner</Badge>
        ) : userPermission === "EDITOR" ? (
          <Badge variant="editor">Can edit</Badge>
        ) : (
          <Badge variant="viewer">Viewer</Badge>
        )}
      </div>

      {/* Column 5: Actions Menu */}
      <div
        className="relative w-8 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex h-7 w-7 items-center justify-center rounded text-foreground-secondary hover:bg-surface hover:text-foreground transition-colors"
          title="Document actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setMenuOpen(false)}
            />
            <div
              className={`absolute right-0 z-50 w-36 rounded-md border border-border bg-surface py-1 shadow-lg text-xs ${
                isLastRow ? "bottom-8" : "top-8"
              }`}
            >
              <Link
                href={`/documents/${id}`}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-foreground hover:bg-surface-secondary"
                onClick={() => setMenuOpen(false)}
              >
                <FileText className="h-3.5 w-3.5 text-foreground-secondary" />
                Open
              </Link>

              {isOwner && onShare && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onShare(id, title);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-foreground hover:bg-surface-secondary"
                >
                  <Share2 className="h-3.5 w-3.5 text-primary" />
                  Share
                </button>
              )}

              {isOwner && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(id, title);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-danger hover:bg-[#FAECEB]"
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
  );
}
