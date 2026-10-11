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
      const response = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${sanitizeNextPath(nextPath)}`,
      });
      if (response.error) {
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
        className="min-h-12 w-full rounded-xl border-agrivive-border bg-white font-semibold text-agrivive-text hover:bg-agrivive-background"
        aria-label="Continue with Google"
      >
        {loading ? <Spinner data-icon="inline-start" /> : <span aria-hidden="true" className="grid size-5 place-items-center rounded-full border border-agrivive-border text-xs font-bold text-agrivive-primary">G</span>}
        {loading ? "Opening Google…" : "Continue with Google"}
      </Button>
      {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
    </div>
  );
}
