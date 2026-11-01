"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, Loader2, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { OtpCodeInput } from "@/src/features/auth/components/OtpCodeInput";

interface ProfileTwoFactorVerifyStepProps {
  totpURI: string | null;
  secretKey: string | null;
  backupCodes: string[];
  onComplete: (backupCodes: string[]) => void;
  onCancel: () => void;
}

export function ProfileTwoFactorVerifyStep({
  totpURI,
  secretKey,
  backupCodes,
  onComplete,
  onCancel,
}: ProfileTwoFactorVerifyStepProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  async function handleVerify(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const cleanCode = code.trim();
    if (cleanCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authClient.twoFactor.verifyTotp({ code: cleanCode });
      if (response.error) {
        setError(response.error.message || "Invalid code. Make sure your device clock is synchronized.");
        return;
      }
      onComplete(backupCodes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify authenticator code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyKey() {
    if (!secretKey) return;
    await navigator.clipboard.writeText(secretKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  return (
    <form onSubmit={handleVerify} className="space-y-5 pt-4">
      <div className="space-y-1">
        <h3 className="font-heading text-sm font-bold text-neutral-900">Set Up Your Authenticator App</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Scan this QR code with Google Authenticator, Authy, or 1Password.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2.5">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {totpURI && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-neutral-50/70 p-5">
          <div className="rounded-xl border border-border/80 bg-white p-3 shadow-sm">
            <QRCodeSVG value={totpURI} size={150} level="M" />
          </div>

          {secretKey && (
            <div className="mt-4 flex flex-col items-center gap-1.5 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Manual Setup Key
              </span>
              <div className="flex items-center gap-2">
                <code className="rounded-lg border border-border/70 bg-white px-2.5 py-1 font-mono text-xs font-bold text-neutral-900">
                  {secretKey}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyKey}
                  className="h-7 rounded-lg px-2 text-xs"
                >
                  {copiedKey ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
          Enter 6-Digit Code
        </label>
        <OtpCodeInput
          value={code}
          onChange={(newVal) => {
            setCode(newVal);
            if (error) setError("");
          }}
          disabled={loading}
          autoFocus
        />
      </div>

      <div className="flex items-center gap-2.5 pt-1">
        <Button
          type="submit"
          disabled={loading || code.length !== 6}
          className="h-11 rounded-full bg-[#457D00] px-5 text-xs font-bold text-white hover:bg-[#457D00]/90/90"
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <ShieldCheck className="size-4" />}
          <span>Verify & Activate</span>
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
