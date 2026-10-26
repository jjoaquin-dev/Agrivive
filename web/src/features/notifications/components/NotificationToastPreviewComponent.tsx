"use client";

import { useState } from "react";
import { Check, X, Zap } from "lucide-react";

export const NotificationToastPreviewComponent = () => {
  const [showSettingsToast, setShowSettingsToast] = useState(true);
  const [showFlashToast, setShowFlashToast] = useState(true);

  if (!showSettingsToast && !showFlashToast) return null;

  return (
    <div className="w-full lg:w-[320px] shrink-0 space-y-3">
      {/* Dark Toast: Settings Saved */}
      {showSettingsToast && (
        <div className="flex items-start gap-3 rounded-2xl bg-[#0F172A] p-4 text-white shadow-lg transition-all animate-in fade-in slide-in-from-top-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white">
            <Check className="size-4 stroke-[2.5]" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-[13px] font-bold leading-tight text-white">Settings Saved</h4>
            <p className="mt-1 text-[11px] leading-snug text-slate-400">
              Your notification preferences have been updated.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSettingsToast(false)}
            aria-label="Dismiss toast"
            className="text-slate-400 transition-colors hover:text-white cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Light Toast: Flash Sale Alert! */}
      {showFlashToast && (
        <div className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-md transition-all animate-in fade-in slide-in-from-top-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
            <Zap className="size-4 fill-current" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-[13px] font-bold leading-tight text-neutral-900">Flash Sale Alert!</h4>
            <p className="mt-1 text-[11px] leading-snug text-neutral-600">
              New produce drops just went live at Agdao Market.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowFlashToast(false)}
            aria-label="Dismiss toast"
            className="text-neutral-400 transition-colors hover:text-neutral-700 cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
