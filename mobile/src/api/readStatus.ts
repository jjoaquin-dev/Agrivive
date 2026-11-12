import { useSyncExternalStore } from "react";

/** When set, the screen is showing saved data because the connection failed. The number is when that data was saved. */
let savedAt: number | null = null;
const listeners = new Set<() => void>();

export function setShowingSaved(value: number | null) {
  if (savedAt === value) return;
  savedAt = value;
  listeners.forEach((listener) => listener());
}

export function useShowingSaved(): number | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    () => savedAt,
  );
}
