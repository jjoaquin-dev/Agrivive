import Elysia from "elysia";
import { authRoleCheckBody, authRoleRegisterBody } from "../model/auth.role-register";
import { checkEmailRoleStatus } from "../services/auth.role-check";
import { registerOrExpandRole } from "../services/auth.role-expand";
import { OrderError } from "../../../utils/order-types";

function roleAuthFailure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
  console.error("Role auth operation failed", error);
  return status(500, { message: "Role operation failed" });
}

export const authRoleRegisterRoute = new Elysia({ prefix: "/auth" })
  .post("/check-email", async ({ body, status }) => {
    try {
      const result = await checkEmailRoleStatus(body.email, body.targetRole);
      return status(200, result);
    } catch (error) {
      return roleAuthFailure(error, status);
    }
  }, { body: authRoleCheckBody })
  .post("/register-role", async ({ request, body, status }) => {
    try {
      const result = await registerOrExpandRole(request.headers, body);
      return status(result.isNewAccount ? 201 : 200, result);
    } catch (error) {
      return roleAuthFailure(error, status);
    }
  }, { body: authRoleRegisterBody });
