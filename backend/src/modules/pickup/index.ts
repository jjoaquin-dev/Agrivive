import Elysia from "elysia";
import { pickupBuyerOrderRoute } from "./index/pickup.buyer.order";
import { pickupSellerOrderRoute } from "./index/pickup.seller.order";
import { pickupStallRoute } from "./index/pickup.stall";

/** Stall setup, pickup times, order steps, declines at pickup, excuses and reschedules. Paths carry their own /seller or /buyer prefix. */
export const pickupRoute = new Elysia({ name: "pickup" }).use(pickupStallRoute).use(pickupSellerOrderRoute).use(pickupBuyerOrderRoute);
