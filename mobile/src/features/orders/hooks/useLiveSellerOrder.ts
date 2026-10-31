import { useEffect } from "react";
import { AppState } from "react-native";
import { fetchSellerOrder } from "../api/seller-orders";
import { useRefreshOnSignal } from "../../../hooks/useRefreshOnSignal";
import type { SellerOrder } from "../types";

/**
 * Keeps an open order fresh: polls while it is pending (10 s, backing off to 60 s, paused in
 * the background) and refreshes at once when a push names this order.
 */
export function useLiveSellerOrder(input: {
  id?: string;
  order: SellerOrder | null;
  isFocused: boolean;
  setOrder: (order: SellerOrder) => void;
  setLastUpdated: (date: Date) => void;
  setError: (message: string | null) => void;
}) {
  const { id, order, isFocused, setOrder, setLastUpdated, setError } = input;

  // The poll below already handles the app returning to the foreground.
  useRefreshOnSignal(async () => {
    if (!id) return;
    try {
      setOrder(await fetchSellerOrder(id));
      setLastUpdated(new Date());
    } catch {}
  }, { pushTypes: ["seller_alert"], referenceId: id, enabled: isFocused, onForeground: false });

  useEffect(() => {
    if (!isFocused || !id || !order || order.status !== "pending") return;
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let delay = 10_000;
    let controller: AbortController | undefined;

    const schedule = () => {
      if (active) timer = setTimeout(() => void refresh(), delay);
    };

    const refresh = async () => {
      if (!active || AppState.currentState !== "active") {
        schedule();
        return;
      }
      controller = new AbortController();
      try {
        const latest = await fetchSellerOrder(id, controller.signal);
        if (!active) return;
        setOrder(latest);
        setLastUpdated(new Date());
        setError(null);
        delay = 10_000;
      } catch (err: any) {
        if (!active || controller.signal.aborted) return;
        if ([401, 403, 404].includes(err?.statusCode)) {
          setError(err?.message || "Could not refresh this order.");
          return;
        }
        setError(err?.message || "Could not refresh this order. Retrying soon.");
        delay = Math.min(delay * 2, 60_000);
      }
      schedule();
    };

    const handleAppState = (nextState: string) => {
      if (nextState !== "active") return;
      if (timer) clearTimeout(timer);
      delay = 10_000;
      void refresh();
    };

    const subscription = AppState.addEventListener("change", handleAppState);
    timer = setTimeout(() => void refresh(), delay);
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      controller?.abort();
      subscription.remove();
    };
  }, [id, isFocused, order?.status]);
}
