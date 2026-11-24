"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (result?.error) {
        setError("Invalid email or password. Please verify your credentials.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Demo123!");
    setError(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 antialiased selection:bg-[#EAEBE6] selection:text-primary">
      <div className="w-full max-w-sm space-y-8">
        {/* Brand & Editorial Welcome */}
        <div className="space-y-2 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 transition-opacity hover:opacity-85">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-white">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">DocSpace</span>
          </Link>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Sign in to your workspace
          </h1>
          <p className="text-xs text-foreground-secondary">
            Enter your credentials to access your documents and collaborations.
          </p>
        </div>

        {/* Minimal Login Card */}
        <div className="rounded-lg border border-border bg-surface p-6 shadow-xs space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="rounded border border-red-200 bg-[#FAECEB] p-2.5 text-[11px] text-danger font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-foreground-secondary">
                Email
              </label>
              <Input
                type="email"
                required
                placeholder="name@docspace.demo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-medium text-foreground-secondary">
                  Password
                </label>
              </div>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full mt-2 h-9 text-xs" isLoading={loading}>
              Sign in
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </form>

          {/* Understated Demo Reviewer Credentials */}
          <div className="pt-4 border-t border-border space-y-2.5">
            <div className="flex items-center justify-between text-[10px] text-foreground-secondary font-medium">
              <span>DEMO REVIEWER ACCOUNTS</span>
              <span>Password: <code className="font-mono text-foreground">Demo123!</code></span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("owner@docspace.demo")}
                className="flex items-center gap-1.5 rounded border border-border bg-surface-secondary px-2.5 py-1.5 text-left text-[11px] text-foreground transition-colors hover:bg-[#EAEBE7]"
              >
                <UserCheck className="h-3 w-3 text-primary shrink-0" />
                <span className="truncate">Demo Owner</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("collaborator@docspace.demo")}
                className="flex items-center gap-1.5 rounded border border-border bg-surface-secondary px-2.5 py-1.5 text-left text-[11px] text-foreground transition-colors hover:bg-[#EAEBE7]"
              >
                <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
                <span className="truncate">Collaborator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Back Link */}
        <p className="text-center text-xs text-foreground-secondary">
          <Link href="/" className="hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
