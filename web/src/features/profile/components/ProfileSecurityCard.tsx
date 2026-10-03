"use client";

import { useState } from "react";
import { CheckCircle, KeyRound, Shield, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { PasswordChecklist } from "@/src/features/auth/components/PasswordChecklist";
import { PasswordInput } from "@/src/features/auth/components/PasswordInput";
import { authClient } from "@/src/lib/auth-client";

type ProfileSecurityCardProps = {
  twoFactorEnabled?: boolean;
};

export function ProfileSecurityCard({ twoFactorEnabled }: ProfileSecurityCardProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    let hasError = false;

    if (!currentPassword) {
      setCurrentPasswordError("Please enter your current password.");
      hasError = true;
    }
    if (newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 characters.");
      hasError = true;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setGeneralError("");
    setSuccess(false);

    try {
      const res = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });

      if (res.error) {
        const msg = res.error.message?.toLowerCase() || "";
        if (msg.includes("current") || msg.includes("incorrect")) {
          setCurrentPasswordError("Current password is incorrect.");
        } else if (msg.includes("match")) {
          setConfirmPasswordError("Passwords do not match.");
        } else {
          setNewPasswordError(res.error.message || "Failed to update password.");
        }
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setGeneralError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-[20px] border border-border/80 bg-white p-6 shadow-[0_10px_28px_rgba(31,77,58,0.05)]">
      <div className="flex items-center justify-between border-b border-border/70 pb-4">
        <div>
          <h2 className="font-heading text-lg font-bold">Password & Security</h2>
          <p className="text-sm text-muted-foreground">Manage your credentials and login safety.</p>
        </div>
        <Badge variant={twoFactorEnabled ? "default" : "outline"} className="gap-1.5 text-xs font-normal">
          {twoFactorEnabled ? (
            <ShieldCheck className="size-3.5 text-emerald-400" />
          ) : (
            <Shield className="size-3.5 text-muted-foreground" />
          )}
          {twoFactorEnabled ? "2FA Active" : "2FA Off"}
        </Badge>
      </div>

      <form onSubmit={handleChangePassword} className="pt-5">
        {success ? (
          <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-800">
            <CheckCircle className="size-4 text-emerald-600" />
            <AlertDescription>Your password has been changed successfully.</AlertDescription>
          </Alert>
        ) : null}

        {generalError ? (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        ) : null}

        <FieldGroup>
          <PasswordInput
            id="current-password"
            label="Current Password"
            placeholder="Enter your existing password"
            value={currentPassword}
            error={currentPasswordError}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (currentPasswordError) setCurrentPasswordError("");
            }}
          />

          <div>
            <PasswordInput
              id="new-password"
              label="New Password"
              placeholder="Create a new password (min. 8 characters)"
              value={newPassword}
              error={newPasswordError}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (newPasswordError) setNewPasswordError("");
              }}
            />
          </div>

          <div>
            <PasswordInput
              id="confirm-new-password"
              label="Confirm New Password"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              error={confirmPasswordError}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setCurrentPasswordError("");
              }}
            />
            <PasswordChecklist password={newPassword} confirmPassword={confirmPassword} />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading || !currentPassword || !newPassword}
              className="min-h-12 rounded-xl px-6 font-semibold active:translate-y-px"
            >
              {loading ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Updating…
                </>
              ) : (
                <>
                  <KeyRound data-icon="inline-start" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </Card>
  );
}
