import { t } from "elysia";

export const disputeBody = t.Object({ reason: t.String({ minLength: 10, maxLength: 1000 }) });
export const idParams = t.Object({ id: t.String({ format: "uuid" }) });
export type DisputeBody = typeof disputeBody.static;
