import Elysia from "elysia";
import { OrderError } from "../../../utils/order-types";
import { verifyRecaptcha } from "../../../utils/recaptcha";
import { trustRecoveryRequestBody, trustRecoveryVerifyBody } from "../model/trust.recovery";
import { requestTrustRecovery, verifyTrustRecovery } from "../services/trust.recovery";

export const trustRecoveryRoute = new Elysia({ name: "trust.recovery" })
  .post("/recovery/request", async ({ request, body, status }) => {
    try {
      await verifyRecaptcha(request.headers);
      return await requestTrustRecovery(body);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Could not send the recovery code" });
    }
  }, {
    body: trustRecoveryRequestBody,
  })
  .post("/recovery/verify", async ({ body, status }) => {
    try {
      return await verifyTrustRecovery(body);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Could not restore the account" });
    }
  }, {
    body: trustRecoveryVerifyBody,
  });
