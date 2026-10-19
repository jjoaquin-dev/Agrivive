import Elysia from "elysia";
import { readStakeholderSummary } from "../services/stakeholder.summary";

export const stakeholderSummaryRoute = new Elysia()
  .get("/summary", async ({ status }) => {
    try {
      return await readStakeholderSummary();
    } catch (error) {
      console.error(error);
      return status(500, { message: "Failed to read stakeholder summary" });
    }
  });
