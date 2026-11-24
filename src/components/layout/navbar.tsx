"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  FileText,
  Plus,
  LogOut,
  FolderOpen,
  Share2,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onCreateDocument?: () => void;
  isCreating?: boolean;
}

export function Navbar({ onCreateDocument, isCreating }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { label: "My Documents", href: "/dashboard", icon: FolderOpen },
    { label: "Shared With Me", href: "/dashboard?tab=shared", icon: Share2 },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground leading-none">DocSpace</span>
              <span className="text-[10px] text-muted font-medium">Workspace</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href.includes("?tab=shared") && pathname === "/dashboard");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-foreground"
                >
                  <Icon className="h-4 w-4 text-muted" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions & User menu */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleCreate}
            isLoading={isCreating}
            size="sm"
            className="hidden sm:inline-flex gap-1.5 bg-primary hover:bg-primary-hover font-semibold text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Document
          </Button>

          {session?.user && (
            <div className="flex items-center gap-3 border-l border-border pl-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {session.user.name || "User"}
                </span>
                <span className="text-[11px] text-muted truncate max-w-[130px]">
                  {session.user.email}
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-primary font-bold text-xs ring-1 ring-indigo-200">
                {session.user.name ? session.user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-slate-100 hover:text-danger"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-md border border-border text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-3 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Icon className="h-4 w-4 text-muted" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border">
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                handleCreate();
              }}
              className="w-full justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Document
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
