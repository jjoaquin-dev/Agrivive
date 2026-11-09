import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerProductId } from "../model/seller.product";
import { sellerAutoPostBody } from "../model/seller.auto-post";
import { setSellerAutoPost } from "../services/seller.auto-post.set";
import { sellerProductFailure } from "./seller.product.failure";

export const sellerAutoPostRoute = new Elysia().use(sessionAuth)
  .patch("/products/:id/auto-post", async ({ session, params, body, status }) => {
    try {
      return await setSellerAutoPost(session.userId, params.id, body.enabled);
    } catch (error) { return sellerProductFailure(error, status); }
  }, { role: ["seller"], params: sellerProductId, body: sellerAutoPostBody });
