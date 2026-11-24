import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocSpace — Your workspace for creating and sharing ideas",
  description: "Lightweight collaborative document editor and document management workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
