import { timingSafeEqual } from "node:crypto";

export function isVisibilityBoostAuthorized(authorization?: string) {
  const expected = process.env.N8N_VISIBILITY_BOOST_SERVICE_TOKEN?.trim();
  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  const provided = Buffer.from(authorization.slice(7).trim());
  const expectedBytes = Buffer.from(expected);
  return provided.length > 0 && provided.length === expectedBytes.length && timingSafeEqual(provided, expectedBytes);
}
