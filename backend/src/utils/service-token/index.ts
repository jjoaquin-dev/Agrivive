import { timingSafeEqual } from "node:crypto";

export function isServiceTokenAuthorized(authorization: string | undefined, expectedToken: string | undefined) {
  const expected = expectedToken?.trim();
  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  const provided = Buffer.from(authorization.slice(7).trim());
  const expectedBytes = Buffer.from(expected);
  return provided.length > 0 && provided.length === expectedBytes.length && timingSafeEqual(provided, expectedBytes);
}
