"use client";

import { useState } from "react";
import { CheckCircle, Mail, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { AuthInput } from "@/src/features/auth/components/AuthInput";
import { authClient } from "@/src/lib/auth-client";

type ProfilePersonalCardProps = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export function ProfilePersonalCard({ user }: ProfilePersonalCardProps) {
  const [name, setName] = useState(user.name || "");
  const [nameError, setNameError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Please enter your name.");
      return;
    }
    setLoading(true);
    setNameError("");
    setGeneralError("");
    setSuccess(false);

    try {
      const res = await authClient.updateUser({ name: name.trim() });
      if (res.error) {
        setNameError(res.error.message || "Could not update name.");
        return;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setGeneralError("Failed to update name. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-[20px] border border-border/80 bg-white p-6 shadow-[0_10px_28px_rgba(31,77,58,0.05)]">
      <div className="border-b border-border/70 pb-4">
        <h2 className="font-heading text-lg font-bold">Personal Information</h2>
        <p className="text-sm text-muted-foreground">
          Update how your name appears on reservations and pickup receipts.
        </p>
      </div>

      <form onSubmit={handleSaveName} className="pt-5">
        {success ? (
          <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-800">
            <CheckCircle className="size-4 text-emerald-600" />
            <AlertDescription>Your personal details were saved successfully.</AlertDescription>
          </Alert>
        ) : null}

        {generalError ? (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        ) : null}

        <FieldGroup>
          <AuthInput
            id="profile-name"
            label="Full Name"
            icon={<User className="size-4" />}
            value={name}
            error={nameError}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            placeholder="Your complete name"
          />

          <AuthInput
            id="profile-email"
            label="Email Address"
            icon={<Mail className="size-4" />}
            value={user.email}
            disabled
            hint="Email is linked to your login and cannot be edited."
            className="cursor-not-allowed bg-muted/50 text-muted-foreground"
          />

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading || name.trim() === (user.name || "")}
              className="min-h-12 rounded-xl px-6 font-semibold active:translate-y-px"
            >
              {loading ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </Card>
  );
}
