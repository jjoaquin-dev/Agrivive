"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type OrderSuccessToastProps = {
  show: boolean;
  onDismiss: () => void;
  title?: string;
  description?: string;
};

export function OrderSuccessToast({
  show,
  onDismiss,
  title = "Cart reserved successfully!",
  description = "Your pickup pass and QR code are ready below.",
}: OrderSuccessToastProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [show, onDismiss]);

  if (!show) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed top-20 right-4 z-50 w-full max-w-sm sm:right-6 animate-in fade-in slide-in-from-top-3 duration-200"
    >
      <Alert className="relative flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-white/95 py-3.5 pl-3.5 pr-9 text-emerald-950 shadow-[0_12px_28px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mt-0.5">
          <CheckCircle2 className="size-4" />
        </span>
        <div className="flex-1 min-w-0 pr-1">
          <AlertTitle className="text-xs font-bold text-emerald-950 leading-snug">
            {title}
          </AlertTitle>
          <AlertDescription className="mt-0.5 text-xs text-emerald-800 leading-snug">
            {description}
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
