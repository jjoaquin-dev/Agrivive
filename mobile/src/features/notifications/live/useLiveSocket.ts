import { useEffect } from "react";
import { AppState } from "react-native";
import { startLiveSocket, stopLiveSocket } from "./liveSocket";

/** Keeps the live socket open while the seller is signed in and the app is on screen. Mount once. */
export function useLiveSocket(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (AppState.currentState === "active") startLiveSocket();
    const subscription = AppState.addEventListener("change", (next) => {
      if (next === "active") startLiveSocket();
      else stopLiveSocket();
    });
    return () => {
      subscription.remove();
      stopLiveSocket();
    };
  }, [enabled]);
}
