import Elysia from "elysia";
import { trustRecoveryRequestBody, trustRecoveryVerifyBody } from "../model/trust.recovery";
import { requestTrustRecovery, verifyTrustRecovery } from "../services/trust.recovery";

export const trustRecoveryRoute = new Elysia({ name: "trust.recovery" })
  .post("/recovery/request", ({ body }) => requestTrustRecovery(body), {
    body: trustRecoveryRequestBody,
  })
  .post("/recovery/verify", ({ body }) => verifyTrustRecovery(body), {
    body: trustRecoveryVerifyBody,
  });
