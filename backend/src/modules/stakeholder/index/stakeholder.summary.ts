import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { readStakeholderSummary } from "../services/stakeholder.summary";

export const stakeholderSummaryRoute = new Elysia().use(sessionAuth)
  .get("/summary", async ({ status }) => {
    try { return await readStakeholderSummary(); }
    catch (error) {
      console.error(error);
      return status(500, { message: "Failed to read stakeholder summary" });
    }
  }, { role: ["stakeholder"] });
