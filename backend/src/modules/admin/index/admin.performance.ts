import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { readAdminPerformance } from "../services/admin.performance";

export const adminPerformanceRoute = new Elysia().use(sessionAuth)
  .get("/performance", async ({ status }) => {
    try { return await readAdminPerformance(); }
    catch (error) {
      console.error(error);
      return status(500, { message: "Failed to read performance" });
    }
  }, { role: ["admin"] });
