import Elysia from "elysia";

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  authMaxRequests?: number;
}

interface ClientRecord {
  count: number;
  resetAt: number;
}

export function createRateLimitPlugin(options: RateLimitOptions = {}) {
  const windowMs = options.windowMs ?? 60_000;
  const maxRequests = options.maxRequests ?? 120;
  const authMaxRequests = options.authMaxRequests ?? 30;
  const maxTrackedClients = 10_000;
  const clients = new Map<string, ClientRecord>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of clients.entries()) {
      if (now > record.resetAt) {
        clients.delete(key);
      }
    }
  }, 60_000).unref?.();

  return new Elysia({ name: "rate-limit-plugin" })
    .onRequest(({ request, set }) => {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path === "/health" || path === "/health/ready" || path === "/") {
        return;
      }

      const rawForwarded = request.headers.get("x-forwarded-for");
      const candidateIp = (rawForwarded ? rawForwarded.split(",")[0].trim() : null)
        || request.headers.get("x-real-ip")
        || "127.0.0.1";
      const isValidIp = /^([0-9]{1,3}\.){3}[0-9]{1,3}$|^[a-f0-9:]+$/i.test(candidateIp);
      const clientIp = isValidIp ? candidateIp : "127.0.0.1";

      const now = Date.now();
      const isAuthRoute = path.startsWith("/api/auth") || path.startsWith("/auth");
      const effectiveLimit = isAuthRoute ? authMaxRequests : maxRequests;

      const recordKey = `${clientIp}:${isAuthRoute ? "auth" : "gen"}`;
      let record = clients.get(recordKey);

      if (!record || now > record.resetAt) {
        if (clients.size >= maxTrackedClients) {
          const oldestKey = clients.keys().next().value;
          if (oldestKey) clients.delete(oldestKey);
        }
        record = { count: 1, resetAt: now + windowMs };
        clients.set(recordKey, record);
      } else {
        record.count++;
      }

      set.headers["x-ratelimit-limit"] = effectiveLimit.toString();
      set.headers["x-ratelimit-remaining"] = Math.max(0, effectiveLimit - record.count).toString();
      set.headers["x-ratelimit-reset"] = Math.ceil(record.resetAt / 1000).toString();

      if (record.count > effectiveLimit) {
        const retryAfterSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
        set.headers["retry-after"] = retryAfterSeconds.toString();
        set.status = 429;
        return { message: "Too many requests, please try again shortly." };
      }
    });
}

export const rateLimitPlugin = createRateLimitPlugin();
