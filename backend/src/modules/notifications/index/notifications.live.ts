import Elysia from "elysia";
import { addLiveSocket, handleLiveCommand, removeLiveSocket } from "../../../utils/live-events";
import { readLiveSocketUserId } from "../../../utils/live-events/socket-user";

/** Sockets that closed while their sign-in was still being checked, so they are never added. */
const closedEarly = new WeakSet<object>();

/**
 * One live socket per open app or tab. Signed-in buyers and sellers hear their own reservation,
 * notice and message changes; anyone can watch a product's stock and price with
 * `{ "type": "watch", "productId": "<uuid>" }`. Events carry ids only.
 */
export const notificationsLiveRoute = new Elysia().ws("/ws/live", {
  // Elysia makes a new wrapper for every event, so the stable Bun socket (`ws.raw`) is the key.
  async open(ws) {
    const userId = await readLiveSocketUserId(ws.data.request.headers);
    if (closedEarly.has(ws.raw)) return;
    addLiveSocket(ws.raw, userId);
    ws.send(JSON.stringify({ type: "live.connected", signedIn: Boolean(userId) }));
  },
  message(ws, message) {
    handleLiveCommand(ws.raw, message);
  },
  close(ws) {
    closedEarly.add(ws.raw);
    removeLiveSocket(ws.raw);
  },
});
