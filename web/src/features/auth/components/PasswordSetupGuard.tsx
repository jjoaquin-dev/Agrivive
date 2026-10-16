"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getPasswordStatus } from "../api/password";
import { authClient } from "@/src/lib/auth-client";
import { sanitizeNextPath } from "@/src/lib/navigation";

const passwordSetupPath = "/password-setup";
const exemptPaths = ["/login", "/signup", "/verify-email", passwordSetupPath];

export function PasswordSetupGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const currentPathname = pathname ?? "/";

  useEffect(() => {
    if (isPending || !session?.user || exemptPaths.some((path) => currentPathname.startsWith(path))) return;

    let cancelled = false;
    getPasswordStatus()
      .then((status) => {
        if (cancelled || !status.passwordSetupRequired) return;
        const nextPath = sanitizeNextPath(`${currentPathname}${window.location.search}`);
        router.replace(`${passwordSetupPath}?next=${encodeURIComponent(nextPath)}`);
      })
      .catch(() => {
        // A status read failure should not log the user out or replace the page.
      });

    return () => {
      cancelled = true;
    };
  }, [currentPathname, isPending, router, session?.user?.id]);

  return null;
}
