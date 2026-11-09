import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { routeError } from "../../../utils/route-error";
import { stallAwayBody, stallClosedBody, stallHoursBody, stallSettingsBody } from "../model/pickup.stall";
import { setAway } from "../services/pickup.stall.away.set";
import { setClosedToday } from "../services/pickup.stall.closed-today.set";
import { saveStallHours } from "../services/pickup.stall.hours.save";
import { readStall } from "../services/pickup.stall.read";
import { saveStallSettings } from "../services/pickup.stall.settings.save";

/** The seller's stall setup: opening hours, Closed today, Away, pickup capacity and range limit. */
export const pickupStallRoute = new Elysia({ prefix: "/seller/stall" }).use(sessionAuth)
  .get("/", async ({ session, status }) => {
    try { return await readStall(session.userId); } catch (error) { return routeError(status, error, "Could not load your stall"); }
  }, { role: ["seller"] })
  .put("/hours", async ({ session, body, status }) => {
    try { return await saveStallHours(session.userId, body); } catch (error) { return routeError(status, error, "Could not save your hours"); }
  }, { role: ["seller"], body: stallHoursBody })
  .put("/settings", async ({ session, body, status }) => {
    try { return await saveStallSettings(session.userId, body); } catch (error) { return routeError(status, error, "Could not save your pickup settings"); }
  }, { role: ["seller"], body: stallSettingsBody })
  .put("/closed-today", async ({ session, body, status }) => {
    try { return await setClosedToday(session.userId, body.closed); } catch (error) { return routeError(status, error, "Could not change Closed today"); }
  }, { role: ["seller"], body: stallClosedBody })
  .put("/away", async ({ session, body, status }) => {
    try { return await setAway(session.userId, body); } catch (error) { return routeError(status, error, "Could not change Away mode"); }
  }, { role: ["seller"], body: stallAwayBody });
