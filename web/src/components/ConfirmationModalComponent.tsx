"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Ban, Check, Loader2, LogOut, X } from "lucide-react";

export type ConfirmationModalVariant = "positive" | "destructive" | "neutral";

export interface ConfirmationModalComponentProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmationModalVariant;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function ConfirmationModalComponent({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = "No",
  variant = "positive",
  icon,
  loading = false,
}: ConfirmationModalComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, loading, onClose]);

  if (!mounted || !open) return null;

  const defaultConfirmLabel =
    confirmLabel ||
    (variant === "positive" ? "Confirm" : variant === "destructive" ? "Sign out" : "Cancel");

  const variantStyles = {
    positive: {
      badgeBg: "bg-[#EAF7E2] text-[#2F6819]",
      defaultIcon: <Check className="size-5" />,
      buttonBg: "bg-[#245914] text-white hover:bg-[#1C470F]",
    },
    destructive: {
      badgeBg: "bg-[#FDE8E8] text-[#991B1B]",
      defaultIcon: <LogOut className="size-5" />,
      buttonBg: "bg-[#880E16] text-white hover:bg-[#720B12]",
    },
    neutral: {
      badgeBg: "bg-[#F1F3F5] text-[#374151]",
      defaultIcon: <Ban className="size-5" />,
      buttonBg: "bg-[#2E3438] text-white hover:bg-[#1F2327]",
    },
  }[variant];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="relative w-full max-w-[400px] rounded-2xl border border-black/5 bg-white p-6 sm:p-7 shadow-md text-center animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50 cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div
          className={`mx-auto flex size-12 items-center justify-center rounded-full ${variantStyles.badgeBg}`}
        >
          {icon ?? variantStyles.defaultIcon}
        </div>

        <h3 id="confirm-modal-title" className="mt-3.5 font-heading text-lg font-bold text-neutral-900">
          {title}
        </h3>
        <p id="confirm-modal-desc" className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-neutral-500">
          {description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 rounded-full bg-[#F0F2F5] text-xs sm:text-sm font-semibold text-[#374151] transition-colors hover:bg-[#E4E7EB] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex h-11 items-center justify-center gap-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer ${variantStyles.buttonBg}`}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : defaultConfirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
