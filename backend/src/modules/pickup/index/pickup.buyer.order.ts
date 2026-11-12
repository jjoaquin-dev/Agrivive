import Elysia, { t } from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { routeError } from "../../../utils/route-error";
import { declineCreateBody } from "../model/pickup.decline";
import { excuseBody } from "../model/pickup.excuse";
import { rescheduleRespondBody } from "../model/pickup.reschedule";
import { createPickupDecline } from "../services/pickup.decline.create";
import { createOrderExcuse } from "../services/pickup.excuse.create";
import { respondToReschedule } from "../services/pickup.reschedule.respond";
import { readBuyerReservationStatus } from "../services/pickup.reservation.status";
import { readPickupSlotsForBuyer } from "../services/pickup.slots.read";
import { readReservationTerms } from "../services/pickup.terms.read";

const params = t.Object({ id: t.String({ format: "uuid" }) });

/** Buyer side: can I reserve, which times are free, decline at pickup, explain a missed pickup, answer a new time. */
export const pickupBuyerOrderRoute = new Elysia({ prefix: "/buyer" }).use(sessionAuth)
  .get("/reservation-status", async ({ session, status }) => {
    try { return await readBuyerReservationStatus(session.userId); } catch (error) { return routeError(status, error, "Could not check your account"); }
  }, { role: ["buyer"] })
  .get("/sellers/:id/pickup-slots", async ({ session, params, status }) => {
    try { return await readPickupSlotsForBuyer(session.userId, params.id); } catch (error) { return routeError(status, error, "Could not load pickup times"); }
  }, { role: ["buyer"], params: t.Object({ id: t.String({ minLength: 1 }) }) })
  .get("/sellers/:id/reservation-terms", async ({ params, status }) => {
    try { return await readReservationTerms(params.id); } catch (error) { return routeError(status, error, "Could not load the pickup terms"); }
  }, { role: ["buyer"], params: t.Object({ id: t.String({ minLength: 1 }) }) })
  .post("/orders/:id/decline", async ({ session, params, body, status }) => {
    try { return await createPickupDecline(session.userId, params.id, body); } catch (error) { return routeError(status, error, "Could not send your decline"); }
  }, { role: ["buyer"], params, body: declineCreateBody, type: "multipart/form-data" })
  .post("/orders/:id/excuse", async ({ session, params, body, status }) => {
    try { return await createOrderExcuse(session.userId, params.id, body); } catch (error) { return routeError(status, error, "Could not send your explanation"); }
  }, { role: ["buyer"], params, body: excuseBody })
  .post("/orders/:id/reschedule/respond", async ({ session, params, body, status }) => {
    try { return await respondToReschedule(session.userId, params.id, body.accept); } catch (error) { return routeError(status, error, "Could not answer the new time"); }
  }, { role: ["buyer"], params, body: rescheduleRespondBody });
