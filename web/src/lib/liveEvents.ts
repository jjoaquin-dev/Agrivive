"use client";

import { apiPath } from "./api";

/** What the API's /ws/live socket sends. Only ids: pages reload the data through the normal API. */
export type LiveEvent =
  | { type: "order.changed"; orderId: string }
  | { type: "product.changed"; productId: string }
  | { type: "notice.created"; kind: string | null }
  | { type: "message.created"; conversationId: string };

type Listener = {
  handler: (event: LiveEvent) => void;
  /** Needs the signed-in user's events (orders, notices, messages). */
  needsUser: boolean;
  /** A product to watch for stock and price changes. */
  productId?: string;
};

const firstDelayMs = 1_000;
const maxDelayMs = 30_000;
/** A visitor socket that a signed-in page needs is reopened at most this often. */
const userRetryMs = 60_000;

const listeners = new Set<Listener>();
const connectionWatchers = new Set<(connected: boolean) => void>();
let socket: WebSocket | null = null;
let connected = false;
let signedIn = false;
let delay = firstDelayMs;
let retryTimer: ReturnType<typeof setTimeout> | undefined;
let lastUserRetry = 0;
let idleTimer: ReturnType<typeof setTimeout> | undefined;
/** Keep the socket a moment after the last listener leaves, so moving between pages does not reconnect. */
const idleCloseMs = 5_000;

function liveUrl() {
  const url = new URL(apiPath("/ws/live"));
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

function setConnected(next: boolean) {
  if (connected === next) return;
  connected = next;
  connectionWatchers.forEach((watch) => watch(next));
}

function send(command: { type: "watch" | "unwatch"; productId: string }) {
  if (socket?.readyState === WebSocket.OPEN && connected) socket.send(JSON.stringify(command));
}

function watchedProducts() {
  return new Set([...listeners].map((item) => item.productId).filter((id): id is string => Boolean(id)));
}

function scheduleReconnect() {
  if (retryTimer || listeners.size === 0) return;
  retryTimer = setTimeout(() => {
    retryTimer = undefined;
    connect();
  }, delay);
  delay = Math.min(delay * 2, maxDelayMs);
}

function connect() {
  if (socket || listeners.size === 0 || typeof window === "undefined") return;
  if (document.visibilityState === "hidden") return;
  const opened = new WebSocket(liveUrl());
  socket = opened;
  opened.onmessage = (message) => {
    let event: (LiveEvent & { signedIn?: boolean }) | { type: "live.connected"; signedIn: boolean };
    try { event = JSON.parse(String(message.data)); } catch { return; }
    if (event.type === "live.connected") {
      delay = firstDelayMs;
      signedIn = Boolean(event.signedIn);
      setConnected(true);
      watchedProducts().forEach((productId) => send({ type: "watch", productId }));
      maybeReopenForUser();
      return;
    }
    listeners.forEach((listener) => listener.handler(event as LiveEvent));
  };
  opened.onclose = () => {
    if (socket !== opened) return;
    socket = null;
    setConnected(false);
    scheduleReconnect();
  };
  opened.onerror = () => opened.close();
}

function disconnect() {
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = undefined;
  const current = socket;
  socket = null;
  setConnected(false);
  current?.close();
}

/** A page that needs the user's events opened while signed out (or before the cookie was set): reopen once in a while. */
function maybeReopenForUser() {
  if (signedIn || !connected) return;
  if (![...listeners].some((item) => item.needsUser)) return;
  if (Date.now() - lastUserRetry < userRetryMs) return;
  lastUserRetry = Date.now();
  disconnect();
  connect();
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      delay = firstDelayMs;
      connect();
    } else {
      disconnect();
    }
  });
}

/** Listens to live events. Opens the shared socket on the first listener and closes it after the last. */
export function subscribeLive(listener: Listener) {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = undefined;
  listeners.add(listener);
  if (listener.productId && !watchedProductsExcept(listener).has(listener.productId)) {
    send({ type: "watch", productId: listener.productId });
  }
  connect();
  maybeReopenForUser();
  return () => {
    listeners.delete(listener);
    if (listener.productId && !watchedProducts().has(listener.productId)) {
      send({ type: "unwatch", productId: listener.productId });
    }
    if (listeners.size === 0 && !idleTimer) {
      idleTimer = setTimeout(() => {
        idleTimer = undefined;
        if (listeners.size === 0) disconnect();
      }, idleCloseMs);
    }
  };
}

function watchedProductsExcept(skip: Listener) {
  return new Set([...listeners].filter((item) => item !== skip).map((item) => item.productId).filter(Boolean));
}

/** True while the live socket is open, so polling can slow down to a fallback pace. */
export function isLiveConnected() {
  return connected;
}

export function onLiveConnection(watch: (connected: boolean) => void) {
  connectionWatchers.add(watch);
  return () => { connectionWatchers.delete(watch); };
}
