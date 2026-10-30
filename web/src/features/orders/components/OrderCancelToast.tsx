"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type OrderCancelToastProps = {
  notice: string | null;
  onDismiss: () => void;
};

export function OrderCancelToast({ notice, onDismiss }: OrderCancelToastProps) {
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [notice, onDismiss]);

  if (!notice) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed top-20 right-4 z-50 w-full max-w-sm sm:right-6 animate-in fade-in slide-in-from-top-3 duration-200"
    >
      <Alert className="relative flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-white/95 py-3.5 pl-3.5 pr-9 text-emerald-950 shadow-[0_12px_28px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-4" />
          </span>
          <AlertDescription className="text-xs font-semibold text-emerald-900 leading-snug">
            {notice}
          </AlertDescription>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full text-emerald-700/60 transition-colors hover:bg-emerald-50 hover:text-emerald-950 cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="size-4" />
        </button>
      </Alert>
    </aside>
  );
}
