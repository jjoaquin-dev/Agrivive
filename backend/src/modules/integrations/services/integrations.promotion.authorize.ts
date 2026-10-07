import { timingSafeEqual } from "node:crypto";

export function isPromotionServiceAuthorized(authorization?: string) {
  const expected = process.env.N8N_PROMOTION_SERVICE_TOKEN?.trim();
  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  const provided = authorization.slice(7).trim();
  const expectedBytes = Buffer.from(expected);
  const providedBytes = Buffer.from(provided);
  if (expectedBytes.length !== providedBytes.length || expectedBytes.length === 0) return false;
  return timingSafeEqual(expectedBytes, providedBytes);
}
