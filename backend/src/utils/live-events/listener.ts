import { Client } from "pg";
import { dispatchLiveNotice, type LiveNotice } from ".";

const channel = "agrivive_live";
const firstRetryMs = 1_000;
const maxRetryMs = 30_000;

/**
 * Keeps one database connection listening on "agrivive_live" and hands each message to the hub.
 * Reconnects with a growing wait. Start it once, in the API process only (the worker has no sockets).
 */
export function startLiveListener() {
  let retryMs = firstRetryMs;
  let stopped = false;

  const connect = async () => {
    if (stopped) return;
    const client = new Client({ connectionString: process.env.DATABASE_URL, keepAlive: true });
    let failed = false;
    const retry = (error: unknown) => {
      if (failed) return;
      failed = true;
      console.error("[Live] Listener lost its database connection:", error);
      client.removeAllListeners();
      client.end().catch(() => {});
      setTimeout(() => void connect(), retryMs);
      retryMs = Math.min(retryMs * 2, maxRetryMs);
    };
    client.on("error", retry);
    client.on("end", () => retry(new Error("connection ended")));
    client.on("notification", (message) => {
      if (message.channel !== channel || !message.payload) return;
      try { dispatchLiveNotice(JSON.parse(message.payload) as LiveNotice); }
      catch (error) { console.error("[Live] Bad live message:", error); }
    });
    try {
      await client.connect();
      await client.query(`LISTEN ${channel}`);
      retryMs = firstRetryMs;
    } catch (error) {
      retry(error);
    }
  };

  void connect();
  return () => { stopped = true; };
}
