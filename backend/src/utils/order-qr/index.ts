import { createHmac, timingSafeEqual } from "node:crypto";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function qrSecret() {
  const secret = process.env.ORDER_QR_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ORDER_QR_SECRET must contain at least 32 characters");
  }
  return secret;
}

export function ensureOrderQrSecret() {
  qrSecret();
}

function signature(orderId: string) {
  return createHmac("sha256", qrSecret())
    .update(`v1.${orderId}`)
    .digest("base64url");
}

export function issueOrderQr(orderId: string) {
  return `v1.${orderId}.${signature(orderId)}`;
}

export function verifyOrderQr(payload: string): string | null {
  const parts = payload.split(".");
  if (
    parts.length !== 3 ||
    parts[0] !== "v1" ||
    !uuidPattern.test(parts[1]) ||
    !/^[A-Za-z0-9_-]{43}$/.test(parts[2])
  ) {
    return null;
  }

  const supplied = Buffer.from(parts[2], "base64url");
  const expected = Buffer.from(signature(parts[1]), "base64url");
  return supplied.length === expected.length &&
    timingSafeEqual(supplied, expected)
    ? parts[1]
    : null;
}
