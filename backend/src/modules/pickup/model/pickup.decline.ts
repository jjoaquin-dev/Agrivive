import { t } from "elysia";
import { declineReasonKeys } from "../../../utils/pickup/decline-reasons";

/** Sent as multipart form data because the photo comes from the in-app camera. */
export const declineCreateBody = t.Object({
  reason: t.UnionEnum(declineReasonKeys),
  details: t.Optional(t.String({ maxLength: 500 })),
  /** JSON text: [{ "itemId": "...", "quantity": 1.5 }]. Left out to decline the whole order. */
  items: t.Optional(t.String({ maxLength: 4000 })),
  /** When the in-app camera took the photo (ISO time). */
  capturedAt: t.Optional(t.String({ maxLength: 40 })),
  photo: t.File({ type: ["image/jpeg", "image/png", "image/webp"], maxSize: "5m" }),
});

export const declineSellerBody = t.Object({
  action: t.UnionEnum(["accept", "dispute"]),
  note: t.Optional(t.String({ maxLength: 500 })),
  capturedAt: t.Optional(t.String({ maxLength: 40 })),
  photo: t.Optional(t.File({ type: ["image/jpeg", "image/png", "image/webp"], maxSize: "5m" })),
});

export type DeclineCreateBody = typeof declineCreateBody.static;
export type DeclineSellerBody = typeof declineSellerBody.static;
