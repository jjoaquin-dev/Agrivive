import Link from "next/link";
import { AlertTriangle, KeyRound } from "lucide-react";

export function TrustAccessNotice({ message }: { message: string }) {
  return (
    <div className="mb-6 rounded-2xl border border-rose-200/80 bg-rose-50/70 p-4 shadow-md sm:p-5">
      <div className="flex items-start gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-600 shadow-sm">
          <AlertTriangle className="size-5" />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-sm font-bold text-rose-950 sm:text-[15px]">
              Reservations Temporarily Paused
            </h2>
            <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-800">
              Restriction
            </span>
          </div>

          <p className="text-xs leading-relaxed text-neutral-600 sm:text-[13px]">
            {message}
          </p>

          <div className="pt-1">
            <Link
              href="/account-recovery"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 hover:text-rose-900 cursor-pointer"
            >
              <KeyRound className="size-3.5" />
              <span>Restore access earlier with email code</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
