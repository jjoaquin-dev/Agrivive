import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { buyer_no_shows, order_declines, order_excuses, order_reschedules, order_status_history, orders, sellers_profile, user } from "../../db/schema";
import type { OrderSide } from "../order-types";
import { isSellerAway } from "./seller-presence";

type OrderRow = typeof orders.$inferSelect;

/** The detail page needs the stall's place, the history, and any open decline, excuse or reschedule. Lists skip this. */
export async function readOrderDetailExtras(row: OrderRow, side: OrderSide) {
  const [stall] = await db.select({
    shopName: sellers_profile.shopName, address: sellers_profile.detailAddress, latitude: sellers_profile.latitude,
    longitude: sellers_profile.longitude, instructions: sellers_profile.pickupInstructions, phone: sellers_profile.phoneNumber,
    lastActiveAt: user.lastActiveAt,
  }).from(sellers_profile).innerJoin(user, eq(user.id, sellers_profile.userId)).where(eq(sellers_profile.userId, row.sellersId)).limit(1);
  const [buyer] = side === "seller" ? await db.select({ name: user.name }).from(user).where(eq(user.id, row.buyersId)).limit(1) : [];
  const [decline] = await db.select().from(order_declines).where(eq(order_declines.orderId, row.id)).limit(1);
  const [excuse] = await db.select().from(order_excuses).where(eq(order_excuses.orderId, row.id)).limit(1);
  const [noShow] = await db.select().from(buyer_no_shows).where(eq(buyer_no_shows.orderId, row.id)).limit(1);
  const reschedules = await db.select().from(order_reschedules).where(eq(order_reschedules.orderId, row.id)).orderBy(desc(order_reschedules.createdAt)).limit(5);
  const history = await db.select().from(order_status_history).where(eq(order_status_history.orderId, row.id)).orderBy(order_status_history.createdAt);
  const directions = stall?.latitude != null && stall.longitude != null
    ? `https://www.google.com/maps/dir/?api=1&destination=${stall.latitude},${stall.longitude}` : null;
  return {
    stall: stall ? { shopName: stall.shopName, address: stall.address, latitude: stall.latitude, longitude: stall.longitude,
      instructions: stall.instructions, phone: stall.phone, directionsUrl: directions, away: isSellerAway(stall.lastActiveAt) } : null,
    buyerName: buyer?.name ?? null,
    decline: decline ? {
      id: decline.id, reason: decline.reason, reasonValid: decline.reasonValid, details: decline.details, items: decline.items, isFull: decline.isFull,
      status: decline.status, sellerResponse: decline.sellerResponse, sellerDueAt: decline.sellerDueAt,
      declinedAt: decline.declinedAt, decidedAt: decline.decidedAt, hasSellerPhoto: !!decline.sellerPhotoKey,
    } : null,
    excuse: excuse ? { reason: excuse.reason, details: excuse.details, status: excuse.status, createdAt: excuse.createdAt } : null,
    noShow: noShow ? { sequence: noShow.sequence, weight: noShow.weight, excused: noShow.excused, createdAt: noShow.createdAt } : null,
    reschedules: reschedules.map((item) => ({ id: item.id, status: item.status, reason: item.reason, newStart: item.newStart, newEnd: item.newEnd, oldStart: item.oldStart, oldEnd: item.oldEnd, proposedBy: item.proposedBy })),
    history: history.map((item) => ({ status: item.status, note: item.note, createdAt: item.createdAt })),
  };
}
