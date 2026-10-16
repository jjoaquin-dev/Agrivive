"use client";

import { useState } from "react";
import { CheckCircle, KeyRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { PasswordChecklist } from "./PasswordChecklist";
import { PasswordInput } from "./PasswordInput";
import { setPassword } from "../api/password";

type SetPasswordFormProps = {
  onSuccess?: () => void;
  buttonLabel?: string;
};

export function SetPasswordForm({ onSuccess, buttonLabel = "Set Password" }: SetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let hasError = false;

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
    setNewPasswordError("");
    setConfirmPasswordError("");
    setGeneralError("");
    setSuccess(false);

    try {
      await setPassword(newPassword, confirmPassword);
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      onSuccess?.();
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : "Could not set your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pt-5">
      {success ? (
        <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-800">
          <CheckCircle className="size-4 text-emerald-600" />
          <AlertDescription>Your password has been set successfully.</AlertDescription>
        </Alert>
      ) : null}

      {generalError ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{generalError}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup>
        <PasswordInput
          id="set-new-password"
          label="New Password"
          placeholder="Create a new password (min. 8 characters)"
          autoComplete="new-password"
          value={newPassword}
          error={newPasswordError}
          onChange={(event) => {
            setNewPassword(event.target.value);
            if (newPasswordError) setNewPasswordError("");
            if (generalError) setGeneralError("");
          }}
        />

        <div>
          <PasswordInput
            id="set-confirm-password"
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            autoComplete="new-password"
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
            disabled={loading || !newPassword || !confirmPassword}
            className="min-h-12 rounded-xl px-6 font-semibold active:translate-y-px"
          >
            {loading ? (
              <>
                <Spinner data-icon="inline-start" />
                Saving…
              </>
            ) : (
              <>
                <KeyRound data-icon="inline-start" />
                {buttonLabel}
              </>
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
