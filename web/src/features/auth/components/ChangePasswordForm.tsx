"use client";

import { useState } from "react";
import { CheckCircle, KeyRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { PasswordChecklist } from "./PasswordChecklist";
import { PasswordInput } from "./PasswordInput";
import { authClient } from "@/src/lib/auth-client";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      const response = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });

      if (response.error) {
        const message = response.error.message?.toLowerCase() || "";
        if (message.includes("current") || message.includes("incorrect")) {
          setCurrentPasswordError("Current password is incorrect.");
        } else if (message.includes("match")) {
          setConfirmPasswordError("Passwords do not match.");
        } else {
          setNewPasswordError(response.error.message || "Failed to update password.");
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
    <form onSubmit={handleSubmit} className="pt-5">
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
          onChange={(event) => {
            setCurrentPassword(event.target.value);
            if (currentPasswordError) setCurrentPasswordError("");
          }}
        />

        <PasswordInput
          id="new-password"
          label="New Password"
          placeholder="Create a new password (min. 8 characters)"
          value={newPassword}
          error={newPasswordError}
          onChange={(event) => {
            setNewPassword(event.target.value);
            if (newPasswordError) setNewPasswordError("");
          }}
        />

        <div>
          <PasswordInput
            id="confirm-new-password"
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            error={confirmPasswordError}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              if (confirmPasswordError) setConfirmPasswordError("");
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
  );
}
