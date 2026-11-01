"use client";

import { useEffect, useState } from "react";
import { Info, Shield, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPasswordStatus } from "@/src/features/auth/api/password";
import { ProfileTwoFactorActiveView } from "./ProfileTwoFactorActiveView";
import { ProfileTwoFactorBackupCodes } from "./ProfileTwoFactorBackupCodes";
import { ProfileTwoFactorSetupWizard } from "./ProfileTwoFactorSetupWizard";

interface ProfileTwoFactorCardProps {
  twoFactorEnabled?: boolean;
  onStatusChange?: () => void;
}

export function ProfileTwoFactorCard({
  twoFactorEnabled = false,
  onStatusChange,
}: ProfileTwoFactorCardProps) {
  const [isActive, setIsActive] = useState(twoFactorEnabled);
  const [view, setView] = useState<"idle" | "wizard" | "backup-codes">("idle");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [passwordSetupRequired, setPasswordSetupRequired] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setIsActive(twoFactorEnabled);
  }, [twoFactorEnabled]);

  useEffect(() => {
    let cancelled = false;
    getPasswordStatus()
      .then((res) => {
        if (!cancelled) {
          setHasPassword(res.hasPassword);
          setPasswordSetupRequired(res.passwordSetupRequired);
        }
      })
      .catch(() => {
        if (!cancelled) setHasPassword(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleWizardComplete(codes: string[]) {
    setIsActive(true);
    setBackupCodes(codes);
    setView(codes.length > 0 ? "backup-codes" : "idle");
    setSuccessMessage("Two-factor authentication has been enabled successfully.");
    onStatusChange?.();
  }

  function handleBackupCodesFinish() {
    setView("idle");
    setBackupCodes([]);
  }

  function handleDisabled() {
    setIsActive(false);
    setView("idle");
    setSuccessMessage("Two-factor authentication has been disabled.");
    onStatusChange?.();
  }

  function handleBackupCodesGenerated(codes: string[]) {
    setBackupCodes(codes);
    setView("backup-codes");
    setSuccessMessage("New backup codes generated.");
  }

  return (
    <Card className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-md">
      <div className="flex items-center justify-between border-b border-border/70 pb-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-neutral-900">Two-Factor Authentication</h2>
          <p className="text-sm text-neutral-500">
            Protect your account with Google Authenticator, Authy, or 1Password.
          </p>
        </div>
        <Badge
          variant={isActive ? "default" : "outline"}
          className={`gap-1.5 text-xs font-normal ${
            isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""
          }`}
        >
          {isActive ? (
            <ShieldCheck className="size-3.5 text-emerald-600" />
          ) : (
            <Shield className="size-3.5 text-muted-foreground" />
          )}
          {isActive ? "2FA Active" : "2FA Off"}
        </Badge>
      </div>

      {successMessage && (
        <Alert className="mt-4 border-emerald-200 bg-emerald-50/70 text-emerald-900 py-2.5">
          <AlertDescription className="text-xs font-medium">{successMessage}</AlertDescription>
        </Alert>
      )}

      {isActive ? (
        view === "backup-codes" ? (
          <ProfileTwoFactorBackupCodes
            backupCodes={backupCodes}
            onFinish={handleBackupCodesFinish}
            title="Your New Backup Codes"
          />
        ) : (
          <ProfileTwoFactorActiveView
            onBackupCodesGenerated={handleBackupCodesGenerated}
            onDisabled={handleDisabled}
          />
        )
      ) : view === "wizard" ? (
        <ProfileTwoFactorSetupWizard
          onComplete={handleWizardComplete}
          onCancel={() => setView("idle")}
        />
      ) : view === "backup-codes" ? (
        <ProfileTwoFactorBackupCodes
          backupCodes={backupCodes}
          onFinish={handleBackupCodesFinish}
        />
      ) : (
        <div className="space-y-4 pt-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Two-factor authentication adds an extra layer of security. Whenever you sign in,
            you will be asked to enter a 6-digit verification code from your authenticator app.
          </p>

          {!hasPassword && passwordSetupRequired ? (
            <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-amber-900">
              <Info className="mt-0.5 size-4 shrink-0 text-amber-700" />
              <p className="text-xs leading-relaxed">
                You signed in with a social provider. Please set an account password in the{" "}
                <strong>Password</strong> section below before enabling two-factor authentication.
              </p>
            </div>
          ) : (
            <div className="pt-1">
              <Button
                type="button"
                onClick={() => {
                  setSuccessMessage("");
                  setView("wizard");
                }}
                className="h-11 rounded-full bg-[#457D00] px-5 text-xs font-bold text-white hover:bg-[#457D00]/90/90"
              >
                <Shield className="size-4" />
                <span>Enable Two-Factor Authentication</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
