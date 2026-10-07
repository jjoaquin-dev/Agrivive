import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { buyerSellerFollowParams } from "../model/buyer.seller.follow";
import { readBuyerSellerFollow } from "../services/buyer.seller.follow.read";
import { saveBuyerSellerFollow } from "../services/buyer.seller.follow.save";
import { removeBuyerSellerFollow } from "../services/buyer.seller.follow.remove";

function followFailure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
  console.error(error);
  return status(500, { message: "Seller follow request failed" });
}

export const buyerSellerFollowRoute = new Elysia().use(sessionAuth)
  .get("/follows/:sellerId", async ({ session, params, status }) => {
    try { return await readBuyerSellerFollow(session.userId, params.sellerId); }
    catch (error) { return followFailure(error, status); }
  }, { role: ["buyer"], params: buyerSellerFollowParams })
  .post("/follows/:sellerId", async ({ session, params, status }) => {
    try { return await saveBuyerSellerFollow(session.userId, params.sellerId); }
    catch (error) { return followFailure(error, status); }
  }, { role: ["buyer"], params: buyerSellerFollowParams })
  .delete("/follows/:sellerId", async ({ session, params, status }) => {
    try { return await removeBuyerSellerFollow(session.userId, params.sellerId); }
    catch (error) { return followFailure(error, status); }
  }, { role: ["buyer"], params: buyerSellerFollowParams });
