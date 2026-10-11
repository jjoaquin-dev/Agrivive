import { t } from "elysia";

export const trustRecoveryRequestBody = t.Object({
  email: t.String({ format: "email" }),
});

export const trustRecoveryVerifyBody = t.Object({
  email: t.String({ format: "email" }),
  otp: t.String({ minLength: 4, maxLength: 12 }),
});

export type TrustRecoveryRequestBody = typeof trustRecoveryRequestBody.static;
export type TrustRecoveryVerifyBody = typeof trustRecoveryVerifyBody.static;
