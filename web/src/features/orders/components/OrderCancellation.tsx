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
    <div>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200/80 bg-rose-50/60 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100/70 transition-colors cursor-pointer"
        onClick={() => {
          setError("");
          setConfirming(true);
        }}
      >
        <XCircle className="size-3.5 text-rose-500" aria-hidden="true" />
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
