import { AlertTriangle } from "lucide-react";
import { TrustAccessNotice } from "@/src/features/trust/components/TrustAccessNotice";

interface Props {
  trustRestriction: string | null;
  trustWarning: string | null;
}

export function BuyerTrustBanner({ trustRestriction, trustWarning }: Props) {
  if (trustRestriction) {
    return (
      <div className="mb-6">
        <TrustAccessNotice message={trustRestriction} />
      </div>
    );
  }

  if (!trustWarning) return null;

  const match = trustWarning.match(/canceled (\d+) reservations/i);
  const cancelCount = match ? match[1] : null;
  const isCancellation = Boolean(cancelCount || trustWarning.toLowerCase().includes("cancel"));

  return (
    <div className="mb-6 rounded-2xl border border-amber-200/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3.5">
        {/* Visual Anchor Icon Badge */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-4 ring-amber-50/60">
          <AlertTriangle className="size-5" />
        </div>

        {/* Content Hierarchy */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-sm font-bold text-neutral-900 sm:text-[15px]">
                {isCancellation ? "Cancellation Advisory" : "Account Notice"}
              </h2>
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                Advisory
              </span>
            </div>

            {cancelCount ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                <span className="size-1.5 rounded-full bg-amber-500" />
                <span>
                  <strong className="font-semibold text-amber-900">{cancelCount}</strong> of 7 cancellations
                </span>
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-[13px]">
            {trustWarning}
          </p>
        </div>
      </div>
    </div>
  );
}
