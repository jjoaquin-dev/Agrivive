import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { routeError } from "../../../utils/route-error";
import { stallClosedBody, stallHoursBody } from "../model/pickup.stall";
import { setClosedToday } from "../services/pickup.stall.closed-today.set";
import { saveStallHours } from "../services/pickup.stall.hours.save";
import { readStall } from "../services/pickup.stall.read";

/** The seller's stall setup: opening hours and Closed today. Away is automatic (see utils/pickup/seller-presence). */
export const pickupStallRoute = new Elysia({ prefix: "/seller/stall" }).use(sessionAuth)
  .get("/", async ({ session, status }) => {
    try { return await readStall(session.userId); } catch (error) { return routeError(status, error, "Could not load your stall"); }
  }, { role: ["seller"] })
  .put("/hours", async ({ session, body, status }) => {
    try { return await saveStallHours(session.userId, body); } catch (error) { return routeError(status, error, "Could not save your hours"); }
  }, { role: ["seller"], body: stallHoursBody })
  .put("/closed-today", async ({ session, body, status }) => {
    try { return await setClosedToday(session.userId, body.closed); } catch (error) { return routeError(status, error, "Could not change Closed today"); }
  }, { role: ["seller"], body: stallClosedBody });
