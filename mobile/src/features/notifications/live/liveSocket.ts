import { authClient, getApiBaseUrl } from "../../../api/client";
import { emitPushReceived } from "../push/pushEvents";

/**
 * The seller's live socket (/ws/live). Each event becomes the same in-app signal a push sends, so every
 * screen that already refreshes on a push (`useRefreshOnSignal`) now refreshes the moment something changes.
 * Events carry ids only; screens reload through the normal API.
 */
type LiveEvent =
  | { type: "live.connected"; signedIn: boolean }
  | { type: "order.changed"; orderId: string }
  | { type: "product.changed"; productId: string }
  | { type: "notice.created"; kind: string | null }
  | { type: "message.created"; conversationId: string }
  | { type: "conversation.updated"; conversationId: string }
  | { type: "marketplace.changed" };

const firstDelayMs = 1_000;
const maxDelayMs = 30_000;

let socket: WebSocket | null = null;
let wanted = false;
let connected = false;
let connectedBefore = false;
let delay = firstDelayMs;
let timer: ReturnType<typeof setTimeout> | undefined;

/** True while the socket is open, so pending-order polling can slow to a fallback pace. */
export function isLiveConnected() {
  return connected;
}

function signal(type: string, referenceId?: string) {
  emitPushReceived({ type, ...(referenceId ? { referenceId } : {}) });
}

function handle(event: LiveEvent) {
  switch (event.type) {
    case "live.connected":
      connected = true;
      delay = firstDelayMs;
      // After a drop, reload lists once in case an event was missed while offline.
      if (connectedBefore) { signal("seller_alert"); signal("seller_message"); signal("seller_stock"); }
      connectedBefore = true;
      return;
    case "order.changed":
      signal("seller_alert", event.orderId);
      return;
    case "product.changed":
      signal("seller_stock", event.productId);
      return;
    case "notice.created":
      signal("seller_alert");
      if (event.kind && /chat|inquiry|message|question/.test(event.kind)) signal("seller_message");
      return;
    case "message.created":
    case "conversation.updated":
      // A new message, or a chat archived, unarchived, blocked or read (maybe on another phone): reload the lists.
      signal("seller_message", event.conversationId);
      return;
    case "marketplace.changed":
      return;
  }
}

function scheduleReconnect() {
  if (!wanted || timer) return;
  timer = setTimeout(() => {
    timer = undefined;
    void connect();
  }, delay);
  delay = Math.min(delay * 2, maxDelayMs);
}

async function connect() {
  if (!wanted || socket) return;
  try {
    const cookie = await authClient.getCookie().catch(() => "");
    const session = await authClient.getSession();
    const token = session.data?.session?.token;
    if (!wanted || socket) return;
    const url = `${getApiBaseUrl().replace(/^http/, "ws")}/ws/live`;
    const WebSocketWithHeaders = WebSocket as unknown as new (url: string, protocols: string[], options: { headers: Record<string, string> }) => WebSocket;
    const opened = new WebSocketWithHeaders(url, [], {
      headers: { ...(cookie ? { cookie } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    socket = opened;
    opened.onmessage = (message) => {
      try { handle(JSON.parse(String(message.data)) as LiveEvent); } catch {}
    };
    opened.onerror = () => opened.close();
    opened.onclose = () => {
      if (socket !== opened) return;
      socket = null;
      connected = false;
      scheduleReconnect();
    };
  } catch {
    scheduleReconnect();
  }
}

/** Opens the socket (signed in and in the foreground). Safe to call more than once. */
export function startLiveSocket() {
  wanted = true;
  delay = firstDelayMs;
  void connect();
}

/** Closes the socket (background or signed out). */
export function stopLiveSocket() {
  wanted = false;
  connected = false;
  if (timer) clearTimeout(timer);
  timer = undefined;
  const current = socket;
  socket = null;
  current?.close();
}
