"use client";

import { useEffect, useRef } from "react";
import { isLiveConnected, onLiveConnection, subscribeLive, type LiveEvent } from "./liveEvents";

/** Reload right away when a matching live event arrives. Polling then only runs as a slow fallback. */
export type LiveTrigger = {
  match: (event: LiveEvent) => boolean;
  /** The events belong to the signed-in user (orders, notices, messages). */
  needsUser?: boolean;
  /** Watch this product's stock and price. */
  productId?: string;
  /** Hear when any listing is added or changes (the marketplace list). */
  feed?: boolean;
};

type PollingOptions = {
  enabled: boolean;
  intervalMs: number;
  maxIntervalMs?: number;
  runImmediately?: boolean;
  onError?: (error: unknown) => void;
  shouldStop?: (error: unknown) => boolean;
  live?: LiveTrigger;
};

/** While the live socket is open, polling is only a safety net at this pace. */
const liveFallbackMs = 60_000;

export function usePolling(
  task: (signal: AbortSignal) => Promise<void>,
  { enabled, intervalMs, maxIntervalMs = 60_000, runImmediately = true, onError, shouldStop, live }: PollingOptions,
) {
  const taskRef = useRef(task);
  const onErrorRef = useRef(onError);
  const shouldStopRef = useRef(shouldStop);
  const liveRef = useRef(live);
  taskRef.current = task;
  onErrorRef.current = onError;
  shouldStopRef.current = shouldStop;
  liveRef.current = live;

  const hasLive = Boolean(live);
  const liveProductId = live?.productId;
  const liveNeedsUser = Boolean(live?.needsUser);
  const liveFeed = Boolean(live?.feed);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    let delay = intervalMs;
    let running = false;
    let runAgain = false;

    const schedule = () => {
      if (!active) return;
      if (timer) clearTimeout(timer);
      const wait = hasLive && isLiveConnected(liveNeedsUser) ? Math.max(delay, liveFallbackMs) : delay;
      timer = setTimeout(() => void run(), wait);
    };

    const run = async () => {
      if (!active) return;
      if (timer) clearTimeout(timer);
      timer = undefined;
      if (document.visibilityState === "hidden") {
        schedule();
        return;
      }
      // A live event during a reload asks for one more reload afterwards, never two at once.
      if (running) {
        runAgain = true;
        return;
      }
      running = true;
      controller = new AbortController();
      try {
        await taskRef.current(controller.signal);
        delay = intervalMs;
      } catch (error) {
        if (!active || controller.signal.aborted) return;
        onErrorRef.current?.(error);
        if (shouldStopRef.current?.(error)) return;
        delay = Math.min(delay * 2, maxIntervalMs);
      } finally {
        running = false;
      }
      if (runAgain && active) {
        runAgain = false;
        void run();
        return;
      }
      schedule();
    };

    const wake = () => {
      delay = intervalMs;
      void run();
    };

    const handleVisibility = () => {
      if (document.visibilityState !== "visible") return;
      wake();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    const stopLive = hasLive
      ? subscribeLive({
        needsUser: liveNeedsUser,
        productId: liveProductId,
        feed: liveFeed,
        handler: (event) => { if (liveRef.current?.match(event)) wake(); },
      })
      : undefined;
    // Reload once when the socket comes back (events may have been missed) or drops (polling takes over).
    const stopConnection = hasLive ? onLiveConnection(() => wake()) : undefined;

    if (runImmediately) void run();
    else schedule();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", handleVisibility);
      stopLive?.();
      stopConnection?.();
    };
  }, [enabled, intervalMs, maxIntervalMs, runImmediately, hasLive, liveProductId, liveNeedsUser, liveFeed]);
}
