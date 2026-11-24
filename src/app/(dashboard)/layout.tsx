"use client";

import { SessionProvider } from "@/components/layout/session-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-background text-foreground antialiased selection:bg-[#EAEBE6] selection:text-primary">
        {children}
      </div>
    </SessionProvider>
  );
}
