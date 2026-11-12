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
      className="fixed inset-x-4 top-[calc(env(safe-area-inset-top)+5rem)] z-[110] sm:inset-x-auto sm:right-6 sm:w-full sm:max-w-sm animate-in fade-in slide-in-from-top-3 duration-200"
    >
      <Alert className="relative flex items-start gap-3 overflow-hidden py-3.5 pl-3.5 pr-12 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
            <CheckCircle2 className="size-4" />
          </span>
          <AlertDescription className="text-xs font-semibold leading-snug text-neutral-800">
            {notice}
          </AlertDescription>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-0.5 top-0.5 flex size-11 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="size-4" />
        </button>
        <span
          aria-hidden="true"
          className="toast-progress absolute inset-x-0 bottom-0 h-0.5 bg-neutral-400/60"
          style={{ animationDuration: "5000ms" }}
        />
      </Alert>
    </aside>
  );
}
