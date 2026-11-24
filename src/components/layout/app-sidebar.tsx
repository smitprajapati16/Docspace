"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  FileText,
  FolderOpen,
  Share2,
  Plus,
  LogOut,
  X,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCreateDocument?: () => void;
  isCreating?: boolean;
}

export function AppSidebar({
  isOpen,
  onClose,
  onCreateDocument,
  isCreating,
}: AppSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get("tab") || "all";
  const router = useRouter();
  const { data: session } = useSession();

  const handleCreate = async () => {
    if (onCreateDocument) {
      onCreateDocument();
      return;
    }

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
      console.error("Failed to create document", err);
    }
  };

  const navItems = [
    {
      label: "Home",
      href: "/dashboard",
      active: pathname === "/dashboard" && currentTab === "all",
      icon: Layers,
    },
    {
      label: "My Documents",
      href: "/dashboard?tab=owned",
      active: pathname === "/dashboard" && currentTab === "owned",
      icon: FolderOpen,
    },
    {
      label: "Shared With Me",
      href: "/dashboard?tab=shared",
      active: pathname === "/dashboard" && currentTab === "shared",
      icon: Share2,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-60 flex-col justify-between border-r border-border bg-[#FAFBF9] transition-transform duration-200 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-lg" : "-translate-x-full md:shadow-none"
        }`}
      >
        {/* Top: Logo & Nav */}
        <div className="flex flex-col p-4 space-y-5">
          {/* Header Brand */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 transition-opacity hover:opacity-85"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold tracking-tight text-foreground">
                DocSpace
              </span>
            </Link>

            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden rounded p-1 text-foreground-secondary hover:bg-surface-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* New Document Button */}
          <Button
            onClick={handleCreate}
            isLoading={isCreating}
            size="sm"
            className="w-full justify-center gap-1.5 h-8 text-xs font-medium bg-primary text-white hover:bg-primary-hover shadow-none"
          >
            <Plus className="h-3.5 w-3.5" />
            New document
          </Button>

          {/* Nav List */}
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    item.active
                      ? "bg-surface text-foreground shadow-xs border border-border/80"
                      : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 text-foreground-secondary shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Profile & Logout */}
        <div className="border-t border-border p-3.5">
          {session?.user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAEBE6] text-primary font-bold text-xs shrink-0">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="truncate">
                  <p className="text-xs font-medium text-foreground truncate leading-tight">
                    {session.user.name}
                  </p>
                  <p className="text-[10px] text-foreground-secondary truncate leading-tight">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Sign out"
                className="rounded p-1 text-foreground-secondary hover:bg-surface-secondary hover:text-danger transition-colors shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
