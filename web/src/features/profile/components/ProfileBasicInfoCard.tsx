"use client";

import { useState } from "react";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/src/lib/auth-client";
import { ProfileDistrictDropdown } from "./ProfileDistrictDropdown";

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
    <Card className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-md">
      <div className="border-b border-border/70 pb-4">
        <h2 className="font-heading text-lg font-bold text-neutral-900">
          Basic Information
        </h2>
        <p className="text-sm text-neutral-500">
          Update your contact details for reservation pickup notifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        {/* First Name & Last Name (2-column pill inputs) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="firstName" className="text-xs font-semibold text-neutral-700">
              First name
            </FieldLabel>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Maria"
              className="h-11 w-full rounded-full border border-neutral-200 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-500 shadow-sm transition-colors focus:border-[#457D00] focus:outline-none focus:ring-2 focus:ring-[#457D00]/15"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName" className="text-xs font-semibold text-neutral-700">
              Last name
            </FieldLabel>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Santos"
              className="h-11 w-full rounded-full border border-neutral-200 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-500 shadow-sm transition-colors focus:border-[#457D00] focus:outline-none focus:ring-2 focus:ring-[#457D00]/15"
            />
          </Field>
        </div>

        {/* Email with Verified Badge */}
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="email" className="text-xs font-semibold text-neutral-700">
              E-mail
            </FieldLabel>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#16A34A]">
              <CheckCircle2 className="size-3 text-[#16A34A]" />
              Verified
            </span>
          </div>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              id="email"
              type="email"
              value={user.email}
              readOnly
              className="h-11 w-full rounded-full border border-neutral-200/80 bg-neutral-50 pl-11 pr-5 text-sm text-neutral-500 cursor-not-allowed"
            />
          </div>
        </Field>

        {/* Phone Number */}
        <Field>
          <FieldLabel htmlFor="phone" className="text-xs font-semibold text-neutral-700">
            Phone number (SMS pickup alerts)
          </FieldLabel>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+63 9XX XXX XXXX"
              className="h-11 w-full rounded-full border border-neutral-200 bg-white pl-11 pr-5 text-sm text-neutral-900 placeholder:text-neutral-500 shadow-sm transition-colors focus:border-[#457D00] focus:outline-none focus:ring-2 focus:ring-[#457D00]/15"
            />
          </div>
        </Field>

        {/* Preferred Market / District with Category Dropdown Design */}
        <Field>
          <FieldLabel htmlFor="district" className="text-xs font-semibold text-neutral-700">
            Preferred Market / District
          </FieldLabel>
          <ProfileDistrictDropdown
            districts={davaoDistricts}
            selectedDistrict={district}
            onSelectDistrict={setDistrict}
          />
        </Field>

        {error ? (
          <Alert variant="destructive" className="text-xs">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {success ? (
          <p className="text-xs font-semibold text-[#16A34A]">
            Account information saved successfully!
          </p>
        ) : null}

        <div className="flex justify-end pt-3">
          <Button
            type="submit"
            disabled={loading}
            className="h-11 rounded-full px-7 font-bold bg-[#457D00] hover:bg-[#14231A] text-white shadow-sm transition active:translate-y-px text-xs flex items-center gap-2 cursor-pointer"
          >
            {loading ? <Spinner data-icon="inline-start" /> : null}
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
