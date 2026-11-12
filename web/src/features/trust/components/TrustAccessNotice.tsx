"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, KeyRound, ShieldCheck } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import { withNextPath } from "@/src/lib/navigation";

type TrustAccessNoticeProps = {
  message: string;
  /** Lets a drawer or modal close itself, so the recovery page is not hidden behind it. */
  onNavigate?: () => void;
};

export function TrustAccessNotice({ message, onNavigate }: TrustAccessNoticeProps) {
  const pathname = usePathname() ?? "/marketplace";
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;
  // A pause ends by itself, so only a block offers the email code. Both messages come from the server.
  const blocked = /restore your account/i.test(message);
  const base = email ? `/account-recovery?email=${encodeURIComponent(email)}` : "/account-recovery";

  return (
    <section aria-labelledby="trust-notice-title" className="mb-4 rounded-2xl border border-rose-200/80 bg-rose-50/70 p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-600 shadow-sm">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full border border-rose-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-rose-800">
            Restriction
          </span>
          <h2 id="trust-notice-title" className="mt-1 font-heading text-base font-bold leading-snug text-rose-950">
            Reservations Temporarily Paused
          </h2>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-neutral-700">{message}</p>

      {blocked ? (
        <Link
          href={withNextPath(base, pathname)}
          onClick={onNavigate}
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-rose-800 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2"
        >
          <KeyRound className="size-4 shrink-0" aria-hidden="true" />
          <span>Restore access with email code</span>
        </Link>
      ) : (
        <Link
          href="/profile#trust"
          onClick={onNavigate}
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-4 text-center text-sm font-semibold text-rose-800 transition hover:bg-rose-50 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2"
        >
          <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
          <span>See my standing and what to do</span>
        </Link>
      )}
    </section>
  );
}
