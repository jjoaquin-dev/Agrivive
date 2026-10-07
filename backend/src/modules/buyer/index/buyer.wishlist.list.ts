import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { listBuyerWishlist } from "../services/buyer.wishlist.list";

export const buyerWishlistListRoute = new Elysia().use(sessionAuth)
  .get("/wishlist", async ({ session }) => listBuyerWishlist(session.userId), { role: ["buyer"] });

