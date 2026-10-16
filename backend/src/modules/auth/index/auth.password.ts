import Elysia from "elysia";
import { sessionAuth } from "../services/auth.session";
import { authPasswordSetBody } from "../model/auth.password";
import { readAuthPasswordStatus } from "../services/auth.password-status";
import { setGoogleAccountPassword } from "../services/auth.password-set";
import { OrderError } from "../../../utils/order-types";

function passwordFailure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
  console.error("Authentication password operation failed", error);
  return status(500, { message: "Password operation failed" });
}

export const authPasswordRoute = new Elysia({ prefix: "/auth" })
  .use(sessionAuth)
  .get("/password-status", async ({ session, status }) => {
    try {
      return await readAuthPasswordStatus(session.userId);
    } catch (error) {
      return passwordFailure(error, status);
    }
  }, { role: ["buyer", "seller"] })
  .post("/password", async ({ session, request, body, status }) => {
    try {
      return await setGoogleAccountPassword(session.userId, request.headers, body);
    } catch (error) {
      return passwordFailure(error, status);
    }
  }, {
    role: ["buyer", "seller"],
    body: authPasswordSetBody,
  });
