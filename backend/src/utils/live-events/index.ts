/**
 * Live events hub (API process only). Sockets join a user channel (signed in), up to
 * `maxProductWatches` product channels, and optionally the marketplace feed channel. Events carry ids only; clients reload through the REST API,
 * which still checks access, so a socket never receives data it could not already read.
 */
export type LiveSocket = { send: (data: string) => unknown };

/** The message the database triggers send on the "agrivive_live" channel. */
export type LiveNotice =
  | { k: "order"; id: string; b: string; s: string }
  | { k: "product"; id: string; s: string }
  | { k: "notice"; u: string; kind?: string }
  | { k: "message"; id: string; b: string; s: string }
  | { k: "convo"; id: string; u: string }
  | { k: "outbox"; t: number };

export const maxProductWatches = 20;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const userSockets = new Map<string, Set<LiveSocket>>();
const productSockets = new Map<string, Set<LiveSocket>>();
const feedSockets = new Set<LiveSocket>();
const socketState = new WeakMap<object, { userId: string | null; products: Set<string>; feed: boolean }>();

function join(map: Map<string, Set<LiveSocket>>, key: string, socket: LiveSocket) {
  let set = map.get(key);
  if (!set) map.set(key, (set = new Set()));
  set.add(socket);
}

function leave(map: Map<string, Set<LiveSocket>>, key: string, socket: LiveSocket) {
  const set = map.get(key);
  set?.delete(socket);
  if (set?.size === 0) map.delete(key);
}

export function addLiveSocket(socket: object & LiveSocket, userId: string | null) {
  socketState.set(socket, { userId, products: new Set(), feed: false });
  if (userId) join(userSockets, userId, socket);
}

export function removeLiveSocket(socket: object & LiveSocket) {
  const state = socketState.get(socket);
  if (!state) return;
  if (state.userId) leave(userSockets, state.userId, socket);
  for (const productId of state.products) leave(productSockets, productId, socket);
  feedSockets.delete(socket);
  socketState.delete(socket);
}

/**
 * Handles `{ type: "watch" | "unwatch", productId }` and `{ type: "watch-feed" | "unwatch-feed" }` from a client.
 * Bad input is ignored.
 */
export function handleLiveCommand(socket: object & LiveSocket, raw: unknown) {
  const state = socketState.get(socket);
  if (!state) return;
  let command: unknown = raw;
  if (typeof raw === "string") {
    try { command = JSON.parse(raw); } catch { return; }
  }
  const { type, productId } = (command ?? {}) as { type?: unknown; productId?: unknown };
  if (type === "watch-feed") {
    state.feed = true;
    feedSockets.add(socket);
    return;
  }
  if (type === "unwatch-feed") {
    state.feed = false;
    feedSockets.delete(socket);
    return;
  }
  if (typeof productId !== "string" || !uuidPattern.test(productId)) return;
  if (type === "watch" && !state.products.has(productId) && state.products.size < maxProductWatches) {
    state.products.add(productId);
    join(productSockets, productId, socket);
  } else if (type === "unwatch" && state.products.delete(productId)) {
    leave(productSockets, productId, socket);
  }
}

function sendTo(sockets: Iterable<LiveSocket> | undefined, payload: string, sent: Set<LiveSocket>) {
  if (!sockets) return;
  for (const socket of sockets) {
    if (sent.has(socket)) continue;
    sent.add(socket);
    try { socket.send(payload); } catch { /* a closing socket is removed by its close handler */ }
  }
}

let outboxHandler: ((dueAtMs: number) => void) | null = null;

/** Called when a phone alert is queued, with the time it becomes due (epoch ms). Used to send the push right then. */
export function setOutboxHandler(handler: (dueAtMs: number) => void) {
  outboxHandler = handler;
}

/** Passes one database message to the sockets that should hear it. */
export function dispatchLiveNotice(notice: LiveNotice) {
  if (notice.k === "outbox") {
    if (Number.isFinite(notice.t)) outboxHandler?.(notice.t);
    return;
  }
  const sent = new Set<LiveSocket>();
  if (notice.k === "order") {
    const payload = JSON.stringify({ type: "order.changed", orderId: notice.id });
    sendTo(userSockets.get(notice.b), payload, sent);
    sendTo(userSockets.get(notice.s), payload, sent);
  } else if (notice.k === "product") {
    const payload = JSON.stringify({ type: "product.changed", productId: notice.id });
    sendTo(productSockets.get(notice.id), payload, sent);
    sendTo(userSockets.get(notice.s), payload, sent);
    // Anyone looking at the marketplace list reloads it (listings added, sold out, or a new stock or price).
    sendTo(feedSockets, JSON.stringify({ type: "marketplace.changed" }), new Set());
  } else if (notice.k === "notice") {
    sendTo(userSockets.get(notice.u), JSON.stringify({ type: "notice.created", kind: notice.kind ?? null }), sent);
  } else if (notice.k === "convo") {
    sendTo(userSockets.get(notice.u), JSON.stringify({ type: "conversation.updated", conversationId: notice.id }), sent);
  } else if (notice.k === "message") {
    const payload = JSON.stringify({ type: "message.created", conversationId: notice.id });
    sendTo(userSockets.get(notice.b), payload, sent);
    sendTo(userSockets.get(notice.s), payload, sent);
  }
}
