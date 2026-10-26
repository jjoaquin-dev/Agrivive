"use client";

import { useState } from "react";
import { KeyRound, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { ProfileTwoFactorPasswordPrompt } from "./ProfileTwoFactorPasswordPrompt";

interface ProfileTwoFactorActiveViewProps {
  onBackupCodesGenerated: (codes: string[]) => void;
  onDisabled: () => void;
}

export function ProfileTwoFactorActiveView({
  onBackupCodesGenerated,
  onDisabled,
}: ProfileTwoFactorActiveViewProps) {
  const [mode, setMode] = useState<"idle" | "disable" | "generate">("idle");

  async function handleDisable(password: string) {
    const response = await authClient.twoFactor.disable({ password });
    if (response.error) {
      throw new Error(response.error.message || "Incorrect password. Could not disable 2FA.");
    }
    onDisabled();
  }

  async function handleGenerateCodes(password: string) {
    const response = await authClient.twoFactor.generateBackupCodes({ password });
    if (response.error) {
      throw new Error(response.error.message || "Incorrect password.");
    }
    const data = response.data as { backupCodes?: string[] } | undefined;
    if (Array.isArray(data?.backupCodes)) {
      onBackupCodesGenerated(data.backupCodes);
    }
  }

  if (mode === "disable") {
    return (
      <ProfileTwoFactorPasswordPrompt
        title="Disable Two-Factor Authentication"
        description="Enter your current password to turn off 2FA. You will no longer be asked for a code at sign-in."
        actionLabel="Confirm Disable"
        actionVariant="destructive"
        onSubmit={handleDisable}
        onCancel={() => setMode("idle")}
      />
    );
  }

  if (mode === "generate") {
    return (
      <ProfileTwoFactorPasswordPrompt
        title="Generate New Backup Codes"
        description="Enter your password to create 10 new recovery codes. Any previously saved codes will become invalid."
        actionLabel="Generate Codes"
        actionVariant="default"
        onSubmit={handleGenerateCodes}
        onCancel={() => setMode("idle")}
      />
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-emerald-950">Two-Factor Authentication is Active</p>
          <p className="text-xs text-emerald-800/90 leading-relaxed">
            Your account is safeguarded with an authenticator app. You will be prompted for a 6-digit
            code whenever you sign in.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setMode("generate")}
          className="h-10 rounded-full border-border/90 px-4 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          <KeyRound className="size-3.5 text-muted-foreground" />
          <span>New Backup Codes</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setMode("disable")}
          className="h-10 rounded-full px-4 text-xs font-semibold text-destructive hover:bg-destructive/10"
        >
          <ShieldAlert className="size-3.5 text-destructive" />
          <span>Disable 2FA</span>
        </Button>
      </div>
    </div>
  );
}
