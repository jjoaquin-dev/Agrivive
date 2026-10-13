import Elysia, { t } from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { queueSellerVisibilityBoost } from "../services/seller.visibility-boost.queue";
import { readSellerVisibilityBoost } from "../services/seller.visibility-boost.read";
import { listSellerVisibilityBoostHistory } from "../services/seller.visibility-boost.history.list";
import { listSellerVisibilityBoostPrompts } from "../services/seller.visibility-boost.prompts.list";
import { readSellerVisibilityBoostPrompt } from "../services/seller.visibility-boost.prompt.read";
import { dismissSellerVisibilityBoostPrompt } from "../services/seller.visibility-boost.prompt.dismiss";
import { acceptSellerVisibilityBoostPrompt } from "../services/seller.visibility-boost.prompt.accept";

const params = t.Object({ id: t.String({ format: "uuid" }) });

function failure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
  console.error("Seller visibility boost request failed", error);
  return status(500, { message: "Boost Visibility could not be completed" });
}

export const sellerVisibilityBoostRoute = new Elysia().use(sessionAuth)
  .get("/products/:id/boost", async ({ session, params: routeParams, status }) => {
    try {
      return await readSellerVisibilityBoost(session.userId, routeParams.id);
    } catch (error) {
      return failure(error, status);
    }
  }, { role: ["seller"], params })
  .post("/products/:id/boost", async ({ session, params: routeParams, status }) => {
    try {
      return await queueSellerVisibilityBoost(session.userId, routeParams.id);
    } catch (error) {
      return failure(error, status);
    }
  }, { role: ["seller"], params })
  .get("/boosts", async ({ session, status }) => {
    try {
      return await listSellerVisibilityBoostHistory(session.userId);
    } catch (error) {
      return failure(error, status);
    }
  }, { role: ["seller"] })
  .get("/boost-prompts", async ({ session, status }) => {
    try {
      return await listSellerVisibilityBoostPrompts(session.userId);
    } catch (error) {
      return failure(error, status);
    }
  }, { role: ["seller"] })
  .post("/boost-prompts/:id/boost", async ({ session, params: routeParams, status }) => {
    try {
      return await acceptSellerVisibilityBoostPrompt(session.userId, routeParams.id);
    } catch (error) {
      return failure(error, status);
    }
  }, { role: ["seller"], params })
  .post("/boost-prompts/:id/read", async ({ session, params: routeParams, status }) => {
    try {
      return await readSellerVisibilityBoostPrompt(session.userId, routeParams.id);
    } catch (error) {
      return failure(error, status);
    }
  }, { role: ["seller"], params })
  .post("/boost-prompts/:id/dismiss", async ({ session, params: routeParams, status }) => {
    try {
      return await dismissSellerVisibilityBoostPrompt(session.userId, routeParams.id);
    } catch (error) {
      return failure(error, status);
    }
  }, { role: ["seller"], params });
