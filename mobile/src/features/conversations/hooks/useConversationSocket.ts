import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { fetchConversationMessages, openConversationSocket } from "../api";
import type { ConversationMessage } from "../types";

const firstDelayMs = 1000;
const maxDelayMs = 30_000;

/**
 * Live messages for an open chat. Reconnects with a growing wait (1 s up to 30 s), closes in
 * the background, and reloads the history after each reconnect so missed messages appear.
 * `addMessage` must skip messages it already has.
 */
export function useConversationSocket(
  conversationId: string | undefined,
  enabled: boolean,
  addMessage: (message: ConversationMessage) => void,
) {
  const [paused, setPaused] = useState(false);
  const addRef = useRef(addMessage);
  addRef.current = addMessage;

  useEffect(() => {
    if (!conversationId || !enabled) return;
    let active = true;
    let foreground = AppState.currentState === "active";
    let socket: WebSocket | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let delay = firstDelayMs;
    let connectedBefore = false;

    const catchUp = async () => {
      try {
        const history = await fetchConversationMessages(conversationId);
        if (active) history.forEach((message) => addRef.current(message));
      } catch {}
    };

    const scheduleReconnect = () => {
      if (!active || !foreground || timer) return;
      setPaused(true);
      timer = setTimeout(() => {
        timer = undefined;
        void connect();
      }, delay);
      delay = Math.min(delay * 2, maxDelayMs);
    };

    const connect = async () => {
      if (!active || !foreground || socket) return;
      let closed = false;
      try {
        const opened = await openConversationSocket(conversationId, {
          onMessage: (message) => addRef.current(message),
          onConnected: () => {
            delay = firstDelayMs;
            setPaused(false);
            if (connectedBefore) void catchUp();
            connectedBefore = true;
          },
          onClose: () => {
            closed = true;
            if (socket === opened) socket = null;
            scheduleReconnect();
          },
          onError: () => setPaused(true),
        });
        if (!active || !foreground) opened.close();
        else if (!closed) socket = opened;
      } catch {
        scheduleReconnect();
      }
    };

    const appState = AppState.addEventListener("change", (next) => {
      if (next === "active") {
        if (foreground) return;
        foreground = true;
        delay = firstDelayMs;
        void catchUp();
        void connect();
      } else if (foreground) {
        foreground = false;
        if (timer) clearTimeout(timer);
        timer = undefined;
        socket?.close();
        socket = null;
      }
    });

    void connect();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      appState.remove();
      socket?.close();
    };
  }, [conversationId, enabled]);

  return { paused };
}
