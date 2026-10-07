"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/src/lib/api";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { cancelBuyerOrder } from "../api/orders";

export function OrderCancellation({ order, onCancelled, onAuthorizationFailure }: {
  order: BuyerOrder;
  onCancelled: (order: BuyerOrder) => void;
  onAuthorizationFailure: (status: number) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  if (order.status !== "pending") return null;

  async function cancel() {
    setCancelling(true);
    setError("");
    try {
      onCancelled(await cancelBuyerOrder(order.id));
      setConfirming(false);
    } catch (reason) {
      if (reason instanceof ApiError && [401, 403].includes(reason.status)) onAuthorizationFailure(reason.status);
      setError(reason instanceof ApiError ? reason.message : "We could not cancel this reservation. Try again.");
    } finally {
      setCancelling(false);
    }
  }

  return <div className="pt-2">
    {!confirming ? <Button type="button" variant="outline" className="min-h-11 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setConfirming(true)}>Cancel reservation</Button> :
      <div className="rounded-[20px] border border-destructive/20 bg-destructive/5 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
          <div>
            <h3 className="font-heading font-bold text-destructive">Cancel this reservation?</h3>
            <p className="mt-1 text-sm text-muted-foreground">If you cancel, your reserved produce will go back to the store so someone else can buy it. You cannot undo this.</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button type="button" variant="destructive" className="min-h-11" onClick={() => void cancel()} disabled={cancelling}>{cancelling ? "Cancelling…" : "Yes, cancel reservation"}</Button>
              <Button type="button" variant="outline" className="min-h-11" onClick={() => setConfirming(false)} disabled={cancelling}>Keep reservation</Button>
            </div>
            {error ? <p role="alert" className="mt-3 text-sm text-destructive">{error}</p> : null}
          </div>
        </div>
      </div>}
  </div>;
}
