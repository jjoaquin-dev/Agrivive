"use client";

import { useState } from "react";
import { CheckCircle2, Mail, MapPin, Phone, ShieldCheck, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/src/lib/auth-client";

interface ProfileBasicInfoCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
  };
}

const davaoDistricts = [
  "Poblacion (Bankerohan Public Market)",
  "Agdao Public Market",
  "Toril Public Market",
  "Buhangin District",
  "Talomo District",
  "Calinan Public Market",
  "Matina District",
];

export function ProfileBasicInfoCard({ user }: ProfileBasicInfoCardProps) {
  // Split full name into first and last name for editing
  const nameParts = (user.name || "").trim().split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "");
  const [phone, setPhone] = useState("+63 912 345 6789");
  const [district, setDistrict] = useState(davaoDistricts[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await authClient.updateUser({ name: fullName });
      if (res.error) {
        setError(res.error.message || "Could not update your information.");
        return;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Failed to update profile. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-[24px] border border-border/80 bg-white p-6 shadow-[0_8px_24px_rgba(31,77,58,0.04)] sm:p-8">
      <div className="border-b border-border/70 pb-4">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Basic Information
        </h2>
        <p className="text-xs text-muted-foreground">
          Update your contact details for reservation pickup notifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        {/* First Name & Last Name (2-column row) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="firstName" className="text-xs font-semibold text-foreground">
              First name
            </FieldLabel>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Maria"
              className="h-11 rounded-xl text-sm"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName" className="text-xs font-semibold text-foreground">
              Last name
            </FieldLabel>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Santos"
              className="h-11 rounded-xl text-sm"
            />
          </Field>
        </div>

        {/* Email with Verified Badge */}
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="email" className="text-xs font-semibold text-foreground">
              E-mail
            </FieldLabel>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="size-3 text-emerald-600" />
              Verified
            </span>
          </div>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={user.email}
              readOnly
              className="h-11 rounded-xl bg-muted/40 pl-10 text-sm text-muted-foreground"
            />
          </div>
        </Field>

        {/* Phone Number */}
        <Field>
          <FieldLabel htmlFor="phone" className="text-xs font-semibold text-foreground">
            Phone number (SMS pickup alerts)
          </FieldLabel>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+63 9XX XXX XXXX"
              className="h-11 rounded-xl pl-10 text-sm"
            />
          </div>
        </Field>

        {/* Preferred Market / District */}
        <Field>
          <FieldLabel htmlFor="district" className="text-xs font-semibold text-foreground">
            Preferred Market / District
          </FieldLabel>
          <select
            id="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agrivive-primary"
          >
            {davaoDistricts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </Field>

        {error ? (
          <Alert variant="destructive" className="text-xs">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {success ? (
          <p className="text-xs font-semibold text-emerald-700">
            Account information saved successfully!
          </p>
        ) : null}

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading} className="min-h-11 px-6 font-semibold">
            {loading ? <Spinner data-icon="inline-start" /> : null}
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
