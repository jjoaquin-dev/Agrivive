import Elysia from "elysia";
import { stakeholderSummaryRoute } from "./index/stakeholder.summary";

export const stakeholderRoute = new Elysia({ prefix: "/stakeholder" })
  .use(stakeholderSummaryRoute);
