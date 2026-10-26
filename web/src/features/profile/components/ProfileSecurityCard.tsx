"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { ChangePasswordForm } from "@/src/features/auth/components/ChangePasswordForm";
import { SetPasswordForm } from "@/src/features/auth/components/SetPasswordForm";
import { getPasswordStatus } from "@/src/features/auth/api/password";

type ProfileSecurityCardProps = {
  twoFactorEnabled?: boolean;
};

export function ProfileSecurityCard({}: ProfileSecurityCardProps = {}) {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [passwordSetupRequired, setPasswordSetupRequired] = useState<boolean | null>(null);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getPasswordStatus()
      .then((status) => {
        if (!cancelled) {
          setHasPassword(status.hasPassword);
          setPasswordSetupRequired(status.passwordSetupRequired);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setStatusError(error instanceof Error ? error.message : "Could not load password settings.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="rounded-[20px] border border-border/80 bg-white p-6 shadow-[0_10px_28px_rgba(31,77,58,0.05)]">
      <div className="border-b border-border/70 pb-4">
        <h2 className="font-heading text-lg font-bold">Account Password</h2>
        <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
      </div>

      {statusError ? (
        <Alert variant="destructive" className="mt-5">
          <AlertDescription>{statusError}</AlertDescription>
        </Alert>
      ) : hasPassword === null ? (
        <p className="pt-5 text-sm text-muted-foreground">Loading password settings…</p>
      ) : !hasPassword && passwordSetupRequired ? (
        <SetPasswordForm
          onSuccess={() => {
            setHasPassword(true);
            setPasswordSetupRequired(false);
          }}
        />
      ) : !hasPassword ? (
        <p className="pt-5 text-sm text-muted-foreground">
          Password setup is not available for this account type.
        </p>
      ) : (
        <ChangePasswordForm />
      )}
    </Card>
  );
}
