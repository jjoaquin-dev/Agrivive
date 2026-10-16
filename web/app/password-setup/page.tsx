"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/src/features/auth/components/AuthShell";
import { SetPasswordForm } from "@/src/features/auth/components/SetPasswordForm";
import { authClient } from "@/src/lib/auth-client";
import { DEFAULT_BUYER_DESTINATION, getNextPathFromLocation } from "@/src/lib/navigation";

export default function PasswordSetupPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [nextPath, setNextPath] = useState(DEFAULT_BUYER_DESTINATION);

  useEffect(() => setNextPath(getNextPathFromLocation()), []);

  useEffect(() => {
    if (!isPending && !session?.user) router.replace("/login");
  }, [isPending, router, session?.user]);

  return (
    <AuthShell
      title="Set your Agrivive password"
      description="Your Google account is connected. Create a password to secure your Agrivive account and continue."
      footer={<p>This password lets you sign in with email and password later.</p>}
    >
      <SetPasswordForm onSuccess={() => router.replace(nextPath)} />
    </AuthShell>
  );
}
