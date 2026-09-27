"use client";

import { useEffect, useRef } from "react";

type PollingOptions = {
  enabled: boolean;
  intervalMs: number;
  maxIntervalMs?: number;
  runImmediately?: boolean;
  onError?: (error: unknown) => void;
  shouldStop?: (error: unknown) => boolean;
};

export function usePolling(
  task: (signal: AbortSignal) => Promise<void>,
  { enabled, intervalMs, maxIntervalMs = 60_000, runImmediately = true, onError, shouldStop }: PollingOptions,
) {
  const taskRef = useRef(task);
  const onErrorRef = useRef(onError);
  const shouldStopRef = useRef(shouldStop);
  taskRef.current = task;
  onErrorRef.current = onError;
  shouldStopRef.current = shouldStop;

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    let delay = intervalMs;

    const schedule = () => {
      if (!active) return;
      timer = setTimeout(() => void run(), delay);
    };

    const run = async () => {
      if (!active) return;
      if (document.visibilityState === "hidden") {
        schedule();
        return;
      }
      controller = new AbortController();
      try {
        await taskRef.current(controller.signal);
        delay = intervalMs;
      } catch (error) {
        if (!active || controller.signal.aborted) return;
        onErrorRef.current?.(error);
        if (shouldStopRef.current?.(error)) return;
        delay = Math.min(delay * 2, maxIntervalMs);
      }
      schedule();
    };

    const handleVisibility = () => {
      if (document.visibilityState !== "visible") return;
      if (timer) clearTimeout(timer);
      delay = intervalMs;
      void run();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    if (runImmediately) void run();
    else schedule();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [enabled, intervalMs, maxIntervalMs, runImmediately]);
}
