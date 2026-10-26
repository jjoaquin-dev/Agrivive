"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/src/features/auth/components/PasswordInput";

interface ProfileTwoFactorPasswordPromptProps {
  title: string;
  description: string;
  actionLabel: string;
  actionVariant?: "default" | "destructive";
  onSubmit: (password: string) => Promise<void>;
  onCancel: () => void;
}

export function ProfileTwoFactorPasswordPrompt({
  title,
  description,
  actionLabel,
  actionVariant = "default",
  onSubmit,
  onCancel,
}: ProfileTwoFactorPasswordPromptProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setError("Please enter your current password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  const isDestructive = actionVariant === "destructive";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-1">
        <h3 className={`font-heading text-sm font-bold ${isDestructive ? "text-destructive" : "text-neutral-900"}`}>
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2.5">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <PasswordInput
        id="prompt-password"
        label="Current Password"
        placeholder="Enter current password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (error) setError("");
        }}
        autoFocus
      />

      <div className="flex items-center gap-2.5 pt-1">
        <Button
          type="submit"
          disabled={loading || !password}
          className={`h-11 rounded-full px-5 text-xs font-bold text-white ${
            isDestructive ? "bg-destructive hover:bg-destructive/90" : "bg-[#386600] hover:bg-[#386600]/90"
          }`}
        >
          {loading && <Loader2 className="size-3.5 animate-spin" />}
          <span>{actionLabel}</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="h-11 rounded-full px-4 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
