import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerPromotionParams, sellerPromotionsQuery } from "../model/seller.promotions";
import { listSellerPromotions } from "../services/seller.promotions.list";
import { readSellerPromotion } from "../services/seller.promotion.read";
import { readAllSellerPromotions } from "../services/seller.promotions.read-all";
import { getSellerPromotionShare } from "../services/seller.promotion.share";

function promotionFailure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError) {
    if (error.statusCode === 409) return status(409, { status: "unavailable", message: error.message });
    return status(error.statusCode, { message: error.message });
  }
  console.error("Seller promotion request failed", error);
  return status(500, { message: "Promotion request failed" });
}

export const sellerPromotionsRoute = new Elysia().use(sessionAuth)
  .get("/promotions", async ({ session, query, status }) => {
    try { return await listSellerPromotions(session.userId, query); }
    catch (error) { return promotionFailure(error, status); }
  }, { role: ["seller"], query: sellerPromotionsQuery })
  .post("/promotions/:id/read", async ({ session, params, status }) => {
    try { return await readSellerPromotion(session.userId, params.id); }
    catch (error) { return promotionFailure(error, status); }
  }, { role: ["seller"], params: sellerPromotionParams })
  .post("/promotions/read-all", async ({ session, status }) => {
    try { return await readAllSellerPromotions(session.userId); }
    catch (error) { return promotionFailure(error, status); }
  }, { role: ["seller"] })
  .get("/promotions/:id/share", async ({ session, params, status }) => {
    try { return await getSellerPromotionShare(session.userId, params.id); }
    catch (error) { return promotionFailure(error, status); }
  }, { role: ["seller"], params: sellerPromotionParams });
