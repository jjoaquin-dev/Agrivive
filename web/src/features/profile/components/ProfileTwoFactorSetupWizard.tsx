"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { PasswordInput } from "@/src/features/auth/components/PasswordInput";
import { ProfileTwoFactorVerifyStep } from "./ProfileTwoFactorVerifyStep";

interface ProfileTwoFactorSetupWizardProps {
  onComplete: (backupCodes: string[]) => void;
  onCancel: () => void;
}

export function ProfileTwoFactorSetupWizard({
  onComplete,
  onCancel,
}: ProfileTwoFactorSetupWizardProps) {
  const [step, setStep] = useState<"password" | "verify">("password");
  const [password, setPassword] = useState("");
  const [totpURI, setTotpURI] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRequestEnable(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      setError("Please enter your current password to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authClient.twoFactor.enable({ password });
      if (response.error) {
        setError(response.error.message || "Incorrect password. Please verify and try again.");
        return;
      }

      const data = response.data as { totpURI?: string; backupCodes?: string[] } | undefined;
      if (data?.totpURI) {
        setTotpURI(data.totpURI);
        const match = data.totpURI.match(/secret=([A-Z0-9]+)/i);
        setSecretKey(match ? match[1] : null);
      }
      if (Array.isArray(data?.backupCodes)) {
        setBackupCodes(data.backupCodes);
      }
      setStep("verify");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate 2FA setup.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "verify") {
    return (
      <ProfileTwoFactorVerifyStep
        totpURI={totpURI}
        secretKey={secretKey}
        backupCodes={backupCodes}
        onComplete={onComplete}
        onCancel={onCancel}
      />
    );
  }

  return (
    <form onSubmit={handleRequestEnable} className="space-y-4 pt-4">
      <div className="space-y-1">
        <h3 className="font-heading text-sm font-bold text-neutral-900">Confirm Your Password</h3>
        <p className="text-xs text-muted-foreground">
          Please enter your current password to begin configuring your authenticator app.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2.5">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <PasswordInput
        id="2fa-password"
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
          className="h-11 rounded-full bg-[#457D00] px-5 text-xs font-bold text-white hover:bg-[#457D00]/90/90"
        >
          {loading && <Loader2 className="size-3.5 animate-spin" />}
          <span>Continue</span>
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
