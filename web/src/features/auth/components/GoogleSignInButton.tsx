"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/src/lib/auth-client";
import { sanitizeNextPath } from "@/src/lib/navigation";

export function GoogleSignInButton({ nextPath }: { nextPath: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await authClient.signOut().catch(() => {});

      const response = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${sanitizeNextPath(nextPath)}`,
      });
      if (response?.data?.url) {
        window.location.href = response.data.url;
        return;
      }
      if (response?.error) {
        setError(response.error.message || "Google sign-in is not available right now.");
        setLoading(false);
      }
    } catch {
      setError("We could not start Google sign-in. Try again or use your email.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => void handleClick()}
        disabled={loading}
        className="group relative flex h-12 w-full items-center justify-center gap-3 rounded-[14px] border border-agrivive-border/80 bg-white px-4 text-sm font-semibold text-agrivive-text shadow-2xs transition-all duration-150 hover:border-slate-300 hover:bg-slate-50/80 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-agrivive-primary/30"
        aria-label="Continue with Google"
      >
        {loading ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <svg className="size-5 shrink-0 transition-transform duration-150 group-hover:scale-105" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        )}
        <span>{loading ? "Opening Google…" : "Continue with Google"}</span>
      </Button>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
