import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { routeError } from "../../../utils/route-error";
import { disputeBody, idParams } from "../model/trust.case";
import { createTrustDispute } from "../services/trust.dispute.create";
import { readMyTrust } from "../services/trust.me.read";

/** A person's own trust page, and disputes (7 days, decided by the system). */
export const trustCaseRoute = new Elysia({ name: "trust.case" }).use(sessionAuth)
  .get("/me", async ({ session, status }) => {
    try { return await readMyTrust(session.userId); } catch (error) { return routeError(status, error, "Could not load your trust page"); }
  }, { role: ["buyer", "seller"] })
  .post("/events/:id/dispute", async ({ session, params, body, status }) => {
    try { return status(201, await createTrustDispute(session.userId, params.id, body)); } catch (error) { return routeError(status, error, "Could not send your dispute"); }
  }, { role: ["buyer", "seller"], params: idParams, body: disputeBody });
