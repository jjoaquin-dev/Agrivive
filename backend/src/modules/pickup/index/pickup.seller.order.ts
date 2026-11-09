import Elysia, { t } from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { routeError } from "../../../utils/route-error";
import { declineSellerBody } from "../model/pickup.decline";
import { excuseDecisionBody } from "../model/pickup.excuse";
import { rescheduleProposeBody } from "../model/pickup.reschedule";
import { confirmSellerOrder } from "../services/pickup.order.confirm";
import { markOrderNoShow } from "../services/pickup.order.no-show";
import { advanceSellerOrder } from "../services/pickup.order.prepare";
import { respondToDecline } from "../services/pickup.decline.respond";
import { decideOrderExcuse } from "../services/pickup.excuse.decide";
import { proposeReschedule } from "../services/pickup.reschedule.propose";
import { getOrder } from "../../../utils/order-read";

const params = t.Object({ id: t.String({ format: "uuid" }) });

/** Seller steps for an order: confirm, pack, ready, no-show, answer a decline, judge an excuse, offer a new time. */
export const pickupSellerOrderRoute = new Elysia({ prefix: "/seller/orders" }).use(sessionAuth)
  .post("/:id/confirm", async ({ session, params, status }) => {
    try { return await confirmSellerOrder(session.userId, params.id); } catch (error) { return routeError(status, error, "Could not confirm the order"); }
  }, { role: ["seller"], params })
  .post("/:id/pack", async ({ session, params, status }) => {
    try { return await advanceSellerOrder(session.userId, params.id, "packed"); } catch (error) { return routeError(status, error, "Could not update the order"); }
  }, { role: ["seller"], params })
  .post("/:id/ready", async ({ session, params, status }) => {
    try { return await advanceSellerOrder(session.userId, params.id, "ready"); } catch (error) { return routeError(status, error, "Could not update the order"); }
  }, { role: ["seller"], params })
  .post("/:id/no-show", async ({ session, params, status }) => {
    try { return await markOrderNoShow(session.userId, params.id); } catch (error) { return routeError(status, error, "Could not record the no-show"); }
  }, { role: ["seller"], params })
  .post("/:id/decline/respond", async ({ session, params, body, status }) => {
    try { return await respondToDecline(session.userId, params.id, body); } catch (error) { return routeError(status, error, "Could not answer the decline"); }
  }, { role: ["seller"], params, body: declineSellerBody })
  .post("/:id/excuse/decide", async ({ session, params, body, status }) => {
    try {
      const outcome = await decideOrderExcuse(session.userId, params.id, body.accept);
      return { ...outcome, order: await getOrder(params.id, session.userId, "seller") };
    } catch (error) { return routeError(status, error, "Could not decide the explanation"); }
  }, { role: ["seller"], params, body: excuseDecisionBody })
  .post("/:id/reschedule", async ({ session, params, body, status }) => {
    try { return await proposeReschedule(session.userId, params.id, body); } catch (error) { return routeError(status, error, "Could not offer a new time"); }
  }, { role: ["seller"], params, body: rescheduleProposeBody });
