import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { onPushReceived, type PushSignal } from "../features/notifications/push/pushEvents";

type Options = {
  /** Push `type` values that should refresh. Leave out to refresh on any push. */
  pushTypes?: string[];
  /** Only refresh for pushes about this record. */
  referenceId?: string;
  /** Turn the signal off, e.g. while the screen is not focused. */
  enabled?: boolean;
  /** Also refresh when the app returns to the foreground. Default true. */
  onForeground?: boolean;
};

const settleMs = 1000;

/**
 * Refreshes when the app comes back to the foreground or a matching push arrives.
 * A burst of signals inside one second causes a single refresh.
 */
export function useRefreshOnSignal(refresh: () => unknown, options: Options = {}) {
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;
  const { pushTypes, referenceId, enabled = true, onForeground = true } = options;
  const typesKey = pushTypes?.join(",") ?? "";

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = undefined;
        void refreshRef.current();
      }, settleMs);
    };

    const matches = (signal: PushSignal) => {
      if (typesKey && (!signal.type || !typesKey.split(",").includes(signal.type))) return false;
      if (referenceId && signal.referenceId !== referenceId) return false;
      return true;
    };

    const removePush = onPushReceived((signal) => { if (matches(signal)) schedule(); });
    const appState = AppState.addEventListener("change", (next) => {
      if (onForeground && next === "active") schedule();
    });
    return () => {
      if (timer) clearTimeout(timer);
      removePush();
      appState.remove();
    };
  }, [enabled, onForeground, referenceId, typesKey]);
}
