"use client";

import { useEffect, useState } from "react";
import { ApiError, isAbortError } from "@/src/lib/api";
import { getReservationStatus, type ReservationStatus } from "./api/reservation";

/** What the server says about this buyer right now: can they reserve, and if not, why. A signed-out visitor sees no restriction. */
export function useReservationStatus(enabled = true) {
  const [status, setStatus] = useState<ReservationStatus | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    getReservationStatus(controller.signal).then(setStatus).catch((reason: unknown) => {
      if (isAbortError(reason) || (reason instanceof ApiError && [401, 403].includes(reason.status))) return;
    });
    return () => controller.abort();
  }, [enabled]);
  return status;
}
