"use client";

import { useState } from "react";
import { XCircle } from "lucide-react";
import { ApiError } from "@/src/lib/api";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { ConfirmationModalComponent } from "@/src/components/ConfirmationModalComponent";
import { cancelBuyerOrder } from "../api/orders";

interface OrderCancellationProps {
  order: BuyerOrder;
  onCancelled: (order: BuyerOrder) => void;
  onAuthorizationFailure: (status: number) => void;
}

export function OrderCancellation({
  order,
  onCancelled,
  onAuthorizationFailure,
}: OrderCancellationProps) {
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  if (order.status !== "pending") return null;
  if (!order.canCancel) {
    const reason = order.cancelBlockedReason ?? "Buyer cancellation is no longer available.";
    return (
      <div className="group relative w-full sm:w-auto">
        <button type="button" disabled aria-disabled="true" aria-describedby="cancel-blocked-reason"
          className="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-100 px-4 text-sm font-semibold text-neutral-400">
          <XCircle className="size-4" aria-hidden="true" /><span>Cancel reservation</span>
        </button>
        <span id="cancel-blocked-reason" role="tooltip" className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden w-72 rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block group-focus-within:block">{reason}</span>
        <p className="mt-2 text-xs text-neutral-500 sm:hidden">{reason}</p>
      </div>
    );
  }

  async function cancel() {
    setCancelling(true);
    setError("");
    try {
      const updated = await cancelBuyerOrder(order.id);
      setConfirming(false);
      onCancelled(updated);
    } catch (reason) {
      if (reason instanceof ApiError && [401, 403].includes(reason.status)) {
        onAuthorizationFailure(reason.status);
      }
      setError(
        reason instanceof ApiError
          ? reason.message
          : "We could not cancel this reservation. Please try again.",
      );
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="w-full sm:w-auto">
      <button
        type="button"
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-rose-200/80 bg-rose-50/60 px-4 text-sm font-semibold text-rose-600 hover:bg-rose-100/70 transition-colors cursor-pointer"
        onClick={() => {
          setError("");
          setConfirming(true);
        }}
      >
        <XCircle className="size-4 text-rose-500" aria-hidden="true" />
        <span>Cancel reservation</span>
      </button>

      {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}

      <ConfirmationModalComponent
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={cancel}
        loading={cancelling}
        variant="neutral"
        title="Cancel Reservation"
        description="Are you sure you want to cancel this reservation? The reserved produce will return to store inventory."
        confirmLabel="Cancel"
        cancelLabel="No"
      />
    </div>
  );
}
