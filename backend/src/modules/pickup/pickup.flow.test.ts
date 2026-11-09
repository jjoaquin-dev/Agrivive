import { beforeAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api-postgres";
import { and, eq, sql } from "drizzle-orm";
import * as schema from "../../db/schema";

process.env.ORDER_QR_SECRET = "test-secret-test-secret-test-secret-1234";
const pg = drizzle({ client: new PGlite() });
const here = import.meta.dir;
mock.module(`${here}/../../db/index.ts`, () => ({ db: pg }));
mock.module(`${here}/../../utils/s3/private-upload.ts`, () => ({ uploadPrivateObject: async (p: { key: string }) => p.key }));
mock.module(`${here}/../../utils/s3/private-download.ts`, () => ({ createPrivateDownloadUrl: async (key: string) => `https://signed.example/${key}` }));

const { createDirectOrder } = await import("../buyer/services/buyer.order.create");
const { createCartCheckout } = await import("../buyer/services/buyer.checkout.create");
const { cancelBuyerOrder } = await import("../buyer/services/buyer.order.cancel");
const { expirePendingOrders } = await import("../buyer/services/buyer.order.expire");
const { confirmSellerOrder } = await import("./services/pickup.order.confirm");
const { advanceSellerOrder } = await import("./services/pickup.order.prepare");
const { autoConfirmOrders } = await import("./services/pickup.order.auto-confirm");
const { scanSellerOrder } = await import("../seller/services/seller.scan-order");
const { cancelSellerOrder } = await import("../seller/services/seller.order.cancel");
const { markOrderNoShow } = await import("./services/pickup.order.no-show");
const { recordUnmarkedNoShows } = await import("./services/pickup.order.no-show.auto");
const { createOrderExcuse } = await import("./services/pickup.excuse.create");
const { decideOrderExcuse } = await import("./services/pickup.excuse.decide");
const { proposeReschedule } = await import("./services/pickup.reschedule.propose");
const { respondToReschedule } = await import("./services/pickup.reschedule.respond");
const { createPickupDecline } = await import("./services/pickup.decline.create");
const { respondToDecline } = await import("./services/pickup.decline.respond");
const { autoAcceptDeclines } = await import("./services/pickup.decline.auto-accept");
const { setAway } = await import("./services/pickup.stall.away.set");
const { setClosedToday } = await import("./services/pickup.stall.closed-today.set");
const { readStall } = await import("./services/pickup.stall.read");
const { readPickupSlotsForBuyer } = await import("./services/pickup.slots.read");
const { createBuyerReview } = await import("../buyer/services/buyer.order.review.create");
const { readSellerRating } = await import("../buyer/services/buyer.seller.rating");
const { screenChatMessage, ChatRuleError } = await import("../../utils/trust/chat-rules");
const { createOrderReport } = await import("../../utils/trust/report");
const { readTrustMonitoringScore } = await import("../../utils/trust/score");
const { readTrustStanding } = await import("../../utils/trust/standing");
const { evaluateTrustAction } = await import("../../utils/trust/evaluate-action");
const { recordTrustEvent } = await import("../../utils/trust");
const { createTrustDispute } = await import("../trust/services/trust.dispute.create");
const { processInquiryDeadlines } = await import("../../utils/trust/process-inquiries");
const { recalculateTrustStanding } = await import("../../utils/trust/recalculate");
const { userStatusCache } = await import("../../utils/user-status-cache");

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
let seq = 0;
const photo = (bytes = 1) => new File([Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.alloc(16, bytes)])], "p.jpg", { type: "image/jpeg" });
const fail = async (p: Promise<unknown>) => { try { await p; } catch (e) { return e as { statusCode: number; message: string }; } throw new Error("expected an error"); };

/** Tomorrow in Manila at the given hour, as an ISO time. Always in the future and inside today/tomorrow. */
function tomorrow(hour: number, minute = 0) {
  const manila = new Date(Date.now() + 8 * HOUR + DAY);
  const key = manila.toISOString().slice(0, 10);
  return new Date(`${key}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+08:00`);
}
const range = (from: number, to: number) => ({ pickupStart: tomorrow(from).toISOString(), pickupEnd: tomorrow(to).toISOString() });

async function addUser(role: "buyer" | "seller") {
  const id = `u${++seq}`;
  await pg.insert(schema.user).values({ id, name: `${role}${seq}`, email: `${id}@t.dev`, role: [role], emailVerified: true });
  return id;
}
async function addSeller(opts: { capacity?: number } = {}) {
  const id = await addUser("seller");
  await pg.insert(schema.sellers_profile).values({ userId: id, shopName: `Stall ${id}`, detailAddress: "Market Rd", phoneNumber: "09171234567", latitude: 14.6, longitude: 121, pickupCapacity: opts.capacity ?? 3 });
  await pg.insert(schema.seller_opening_hours).values([0, 1, 2, 3, 4, 5, 6].map((weekday) => ({ sellerId: id, weekday, isClosed: false, opensMinute: 6 * 60, closesMinute: 20 * 60 })));
  const [product] = await pg.insert(schema.sellers_product).values({ userId: id, productName: "Tomato", productType: "Leafy Greens", scalingType: "kilo", productPrice: "20", productQty: "100", originalQty: "100", isMarketable: true, publishedAt: new Date() }).returning();
  return { id, productId: product!.id };
}
async function reserve(buyer: string, seller: { productId: string }, from = 10, to = 11, quantity = 5) {
  const { order } = await createDirectOrder(buyer, { productId: seller.productId, quantity, ...range(from, to) }, `k${++seq}`);
  return order.id as string;
}
const stock = async (productId: string) => Number((await pg.select().from(schema.sellers_product).where(eq(schema.sellers_product.id, productId)))[0]!.productQty);
const points = async (userId: string) => (await readTrustMonitoringScore(userId)).weightedPoints;
const orderRow = async (id: string) => (await pg.select().from(schema.orders).where(eq(schema.orders.id, id)))[0]!;
/** Moves an order's pickup into the QR window right now. */
async function openWindow(orderId: string, startMinsAgo = 10, endMinsAhead = 50) {
  const now = Date.now();
  await pg.update(schema.orders).set({ pickupStart: new Date(now - startMinsAgo * 60_000), pickupEnd: new Date(now + endMinsAhead * 60_000), expiresAt: new Date(now + (endMinsAhead + 15) * 60_000) }).where(eq(schema.orders.id, orderId));
}
const qr = async (orderId: string, seller: string) => {
  const { issueOrderQr } = await import("../../utils/order-qr");
  void seller;
  return issueOrderQr(orderId);
};

beforeAll(async () => { await (await pushSchema(schema as never, pg as never)).apply(); });
beforeEach(async () => { userStatusCache.clear(); await pg.execute(sql`truncate table "user" cascade`); });

describe("reservation rules", () => {
  test("a reservation holds stock, stores the pickup range and a QR that lasts until 15 minutes after it ends", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller, 10, 11);
    const order = await orderRow(id);
    expect(order.status).toBe("pending");
    expect(order.pickupStart).toEqual(tomorrow(10)); expect(order.pickupEnd).toEqual(tomorrow(11));
    expect(order.expiresAt).toEqual(new Date(tomorrow(11).getTime() + 15 * 60_000));
    expect(order.confirmedAt).toBeNull();
    expect(await stock(seller.productId)).toBe(95);
    expect((await pg.select().from(schema.order_status_history)).map((r) => r.status)).toContain("placed");
  });
  test("two sellers at overlapping times are refused for the same buyer, and a clean time works", async () => {
    const buyer = await addUser("buyer"); const a = await addSeller(); const b = await addSeller();
    await reserve(buyer, a, 8, 9);
    const error = await fail(reserve(buyer, b, 8, 9));
    expect(error.statusCode).toBe(409); expect(error.message).toContain("already have a pickup");
    expect(await stock(b.productId)).toBe(100);
    await reserve(buyer, b, 9, 10);
  });
  test("a cancelled order no longer blocks the same time", async () => {
    const buyer = await addUser("buyer"); const a = await addSeller(); const b = await addSeller();
    const first = await reserve(buyer, a, 8, 9);
    await cancelBuyerOrder(first, buyer);
    await reserve(buyer, b, 8, 9);
  });
  test("two simultaneous requests cannot both take the same time", async () => {
    const buyer = await addUser("buyer"); const a = await addSeller(); const b = await addSeller();
    const results = await Promise.allSettled([reserve(buyer, a, 12, 13), reserve(buyer, b, 12, 13)]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
  });
  test("seller capacity is respected", async () => {
    const seller = await addSeller({ capacity: 1 });
    const [b1, b2] = [await addUser("buyer"), await addUser("buyer")];
    await reserve(b1, seller, 10, 11);
    expect((await fail(reserve(b2, seller, 10, 11))).message).toContain("fully booked");
    await reserve(b2, seller, 11, 12);
  });
  test("outside the hours, on a closed day and after Closed today are refused", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    expect((await fail(reserve(buyer, seller, 4, 5))).statusCode).toBe(409);
    expect((await fail(reserve(buyer, seller, 19, 20))).statusCode).toBe(409);
    await pg.update(schema.sellers_profile).set({ closedDate: new Date(Date.now() + 8 * HOUR + DAY).toISOString().slice(0, 10) });
    expect((await fail(reserve(buyer, seller, 10, 11))).statusCode).toBe(409);
  });
  test("Closed today keeps the weekly hours and turns itself off by date", async () => {
    const seller = await addSeller();
    const stall = await setClosedToday(seller.id, true);
    expect(stall.closedToday).toBe(true); expect(stall.hours.every((d) => d.configured)).toBe(true);
    expect((await setClosedToday(seller.id, false)).closedToday).toBe(false);
  });
  test("the calendar lists today and tomorrow and marks a taken time", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller({ capacity: 1 });
    await reserve(await addUser("buyer"), seller, 10, 11);
    const slots = await readPickupSlotsForBuyer(buyer, seller.id);
    expect(slots.days).toHaveLength(2);
    const cell = slots.days[1]!.cells!.find((c) => c.start === tomorrow(10).toISOString());
    expect(cell?.available).toBe(false); expect(cell?.full).toBe(true);
  });
  test("a paused or blocked buyer cannot reserve through the API service", async () => {
    const seller = await addSeller();
    const paused = await addUser("buyer");
    await pg.insert(schema.trust_actions).values({ actionKey: "p1", subjectId: paused, actionType: "temporary_restriction", level: "pause_24h", weightedPoints: 6, policyVersion: "x", reason: "Paused.", endsAt: new Date(Date.now() + HOUR) });
    expect((await fail(reserve(paused, seller))).statusCode).toBe(403);
    const blocked = await addUser("buyer");
    await pg.update(schema.user).set({ isActive: false }).where(eq(schema.user.id, blocked));
    expect((await fail(reserve(blocked, seller))).statusCode).toBe(403);
    expect(await stock(seller.productId)).toBe(100);
  });
  test("a multi-seller cart needs a pickup for each seller and keeps them from overlapping", async () => {
    const buyer = await addUser("buyer"); const a = await addSeller(); const b = await addSeller();
    const items = [{ productId: a.productId, quantity: 1 }, { productId: b.productId, quantity: 1 }];
    const same = [{ sellerId: a.id, ...range(10, 11) }, { sellerId: b.id, ...range(10, 11) }];
    expect((await fail(createCartCheckout(buyer, { items, pickups: same }, "c1"))).statusCode).toBe(409);
    expect(await stock(a.productId)).toBe(100);
    const missing = await fail(createCartCheckout(buyer, { items, pickups: [{ sellerId: a.id, ...range(10, 11) }] }, "c2"));
    expect(missing.statusCode).toBe(400);
    const ok = await createCartCheckout(buyer, { items, pickups: [{ sellerId: a.id, ...range(10, 11) }, { sellerId: b.id, ...range(11, 12) }] }, "c3");
    expect(ok.orders).toHaveLength(2);
  });
});

describe("confirmation and cancellation", () => {
  test("the seller confirms; the buyer can no longer cancel and the API refuses", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller);
    await confirmSellerOrder(seller.id, id);
    expect((await orderRow(id)).confirmationMode).toBe("manual");
    const error = await fail(cancelBuyerOrder(id, buyer));
    expect(error.statusCode).toBe(409); expect(error.message).toBe("This order has already been confirmed by the seller. Buyer cancellation is no longer available.");
    expect(await stock(seller.productId)).toBe(95);
  });
  test("before confirmation the buyer can cancel and stock and time are released", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller);
    await cancelBuyerOrder(id, buyer);
    expect(await stock(seller.productId)).toBe(100);
    expect((await orderRow(id)).status).toBe("cancelled");
  });
  test("3 hours after placing, the system confirms once and both sides are told", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller);
    expect(await autoConfirmOrders()).toBe(0);
    await pg.update(schema.orders).set({ createdAt: new Date(Date.now() - 3 * HOUR - 1000) });
    expect(await autoConfirmOrders()).toBe(1);
    expect(await autoConfirmOrders()).toBe(0);
    const order = await orderRow(id);
    expect(order.confirmationMode).toBe("auto");
    expect((await fail(confirmSellerOrder(seller.id, id))).statusCode).toBe(409);
    expect(await pg.select().from(schema.trust_notices).where(eq(schema.trust_notices.noticeKey, `order-confirmed:${id}`))).toHaveLength(1);
    expect(await pg.select().from(schema.seller_notifications).where(eq(schema.seller_notifications.dedupeKey, `order-auto-confirmed:${id}`))).toHaveLength(1);
  });
  test("just under 3 hours is not confirmed, a cancelled order never is", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller);
    await pg.update(schema.orders).set({ createdAt: new Date(Date.now() - 3 * HOUR + 60_000) });
    expect(await autoConfirmOrders()).toBe(0);
    await cancelBuyerOrder(id, buyer);
    await pg.update(schema.orders).set({ createdAt: new Date(Date.now() - 4 * HOUR) });
    expect(await autoConfirmOrders()).toBe(0);
  });
  test("a cancellation within 3 hours of pickup adds 1 point; an earlier one adds none", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const early = await reserve(buyer, seller, 10, 11);
    await cancelBuyerOrder(early, buyer);
    expect(await points(buyer)).toBe(0);
    const late = await reserve(buyer, seller, 10, 11);
    await pg.update(schema.orders).set({ pickupStart: new Date(Date.now() + 3 * HOUR), pickupEnd: new Date(Date.now() + 4 * HOUR), expiresAt: new Date(Date.now() + 5 * HOUR) }).where(eq(schema.orders.id, late));
    await cancelBuyerOrder(late, buyer);
    expect(await points(buyer)).toBe(1);
  });
  test("a seller cancelling a confirmed order gets 2 points; an unconfirmed one gets none", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const unconfirmed = await reserve(buyer, seller, 8, 9);
    await cancelSellerOrder(seller.id, unconfirmed, "Out of stock today");
    expect(await points(seller.id)).toBe(0);
    const confirmed = await reserve(buyer, seller, 10, 11);
    await confirmSellerOrder(seller.id, confirmed);
    await cancelSellerOrder(seller.id, confirmed, "Out of stock today");
    expect(await points(seller.id)).toBe(2);
  });
  test("progress steps follow the backend and ready is not completed", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller);
    const { getOrder } = await import("../../utils/order-read");
    expect((await getOrder(id, buyer, "buyer")).progress.current).toBe("placed");
    await confirmSellerOrder(seller.id, id);
    expect((await getOrder(id, buyer, "buyer")).progress.current).toBe("confirmed");
    await advanceSellerOrder(seller.id, id, "packed");
    expect((await getOrder(id, buyer, "buyer")).progress.current).toBe("preparing");
    await advanceSellerOrder(seller.id, id, "ready");
    const view = await getOrder(id, buyer, "buyer");
    expect(view.progress.current).toBe("ready"); expect(view.status).toBe("pending"); expect(view.canCancel).toBe(false);
    expect(view.cancelBlockedReason).toContain("Buyer cancellation is no longer available");
    expect(view.disclaimer).toBe("Agrivive does not check produce quality. Please look over your items when you pick up.");
  });
  test("packing before confirming is refused", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller);
    expect((await fail(advanceSellerOrder(seller.id, id, "packed"))).statusCode).toBe(409);
  });
});

describe("QR pickup", () => {
  test("a valid scan, even before the pickup time, completes the order once", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller(); const other = await addSeller();
    const id = await reserve(buyer, seller);
    const payload = await qr(id, seller.id);
    // Scanning before the pickup time is allowed: early buyers are served, and points only count for a no-show.
    expect((await fail(scanSellerOrder(other.id, { qrPayload: payload }))).statusCode).toBe(403);
    expect((await fail(scanSellerOrder(seller.id, { qrPayload: "v1.bad.bad" }))).statusCode).toBe(400);
    await scanSellerOrder(seller.id, { qrPayload: payload });
    expect((await orderRow(id)).status).toBe("completed");
    expect((await fail(scanSellerOrder(seller.id, { qrPayload: payload }))).message).toContain("already completed");
    const scans = (await pg.select().from(schema.order_qr_scans)).map((s) => s.result);
    expect(scans).toEqual(expect.arrayContaining(["ok", "wrong_seller", "invalid", "completed"]));
  });
  test("the QR still works 15 minutes after the slot ends and is expired after that", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller);
    const payload = await qr(id, seller.id);
    const now = Date.now();
    await pg.update(schema.orders).set({ pickupStart: new Date(now - 75 * 60_000), pickupEnd: new Date(now - 14 * 60_000), expiresAt: new Date(now + 60_000) }).where(eq(schema.orders.id, id));
    await scanSellerOrder(seller.id, { qrPayload: payload });
    const late = await reserve(buyer, seller, 14, 15);
    await pg.update(schema.orders).set({ pickupStart: new Date(now - 90 * 60_000), pickupEnd: new Date(now - 16 * 60_000), expiresAt: new Date(now - 60_000) }).where(eq(schema.orders.id, late));
    const error = await fail(scanSellerOrder(seller.id, { qrPayload: await qr(late, seller.id) }));
    expect(error.statusCode).toBe(410); expect(error.message).toContain("expired");
    expect((await orderRow(late)).status).toBe("pending");
  });
  test("a cancelled order's QR is rejected, and a new order has a new QR", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const a = await reserve(buyer, seller, 8, 9);
    await cancelBuyerOrder(a, buyer);
    expect((await fail(scanSellerOrder(seller.id, { qrPayload: await qr(a, seller.id) }))).message).toContain("cancelled");
    const b = await reserve(buyer, seller, 8, 9);
    expect(await qr(a, seller.id)).not.toBe(await qr(b, seller.id));
  });
  test("an unconfirmed order scanned at the stall is confirmed by the scan", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller); await openWindow(id);
    await scanSellerOrder(seller.id, { qrPayload: await qr(id, seller.id) });
    expect((await orderRow(id)).confirmedAt).not.toBeNull();
  });
  test("an unpicked reservation ends when its QR runs out and frees the stock", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller);
    await pg.update(schema.orders).set({ expiresAt: new Date(Date.now() - 1000) }).where(eq(schema.orders.id, id));
    expect(await expirePendingOrders()).toBe(1);
    expect(await expirePendingOrders()).toBe(0);
    expect(await stock(seller.productId)).toBe(100);
    expect(await points(buyer)).toBe(0);
  });
});

describe("decline at pickup", () => {
  async function arrived() {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller, 10, 11, 10);
    await confirmSellerOrder(seller.id, id); await openWindow(id);
    return { buyer, seller, id };
  }
  test("a valid decline the seller accepts: seller +2, buyer 0, stock not restored, fault rate counts it", async () => {
    const { buyer, seller, id } = await arrived();
    await createPickupDecline(buyer, id, { reason: "spoiled", photo: photo(1) });
    expect(await points(seller.id)).toBe(0);
    await respondToDecline(seller.id, id, { action: "accept" });
    expect(await points(seller.id)).toBe(2); expect(await points(buyer)).toBe(0);
    expect(await stock(seller.productId)).toBe(90);
    const order = await orderRow(id);
    expect(order.status).toBe("declined");
    const standing = await readTrustStanding(seller.id);
    expect(standing.fault?.upheldDeclines).toBe(1);
  });
  test("no answer in 24 hours counts as accepted, once", async () => {
    const { buyer, seller, id } = await arrived();
    await createPickupDecline(buyer, id, { reason: "wrong_item", photo: photo(2) });
    expect(await autoAcceptDeclines()).toBe(0);
    await pg.update(schema.order_declines).set({ sellerDueAt: new Date(Date.now() - 1000) });
    expect(await autoAcceptDeclines()).toBe(1);
    expect(await autoAcceptDeclines()).toBe(0);
    expect(await points(seller.id)).toBe(2);
  });
  test("an invalid reason ends at once: buyer +1, seller 0, produce back in stock", async () => {
    const { buyer, seller, id } = await arrived();
    await createPickupDecline(buyer, id, { reason: "small_size", photo: photo(3) });
    expect(await points(buyer)).toBe(1); expect(await points(seller.id)).toBe(0);
    expect(await stock(seller.productId)).toBe(100);
    expect((await readTrustStanding(seller.id)).fault?.upheldDeclines).toBe(0);
  });
  test("a disputed decline gives nobody points, closes as declined at pickup, and the produce is not put back", async () => {
    const { buyer, seller, id } = await arrived();
    await createPickupDecline(buyer, id, { reason: "spoiled", photo: photo(4) });
    await respondToDecline(seller.id, id, { action: "dispute", note: "It was fresh", photo: photo(5) });
    const [decline] = await pg.select().from(schema.order_declines);
    expect(decline!.status).toBe("disputed"); expect(decline!.sellerResponse).toBe("disputed"); expect(decline!.sellerPhotoKey).not.toBeNull();
    expect([await points(buyer), await points(seller.id)]).toEqual([0, 0]);
    expect((await orderRow(id)).status).toBe("declined");
    expect(await stock(seller.productId)).toBeLessThan(100);
    expect((await readTrustStanding(seller.id)).fault?.upheldDeclines).toBe(0);
  });
  test("a photo already used on another decline is closed by the system as false or reused: buyer +2, seller 0", async () => {
    const one = await arrived(); const two = await arrived();
    await createPickupDecline(one.buyer, one.id, { reason: "spoiled", photo: photo(8) });
    await createPickupDecline(two.buyer, two.id, { reason: "spoiled", photo: photo(8) });
    const second = (await pg.select().from(schema.order_declines)).find((r) => r.orderId === two.id)!;
    expect(second.photoReused).toBe(true); expect(second.status).toBe("buyer_false_photo");
    expect(await points(two.buyer)).toBe(2); expect(await points(two.seller.id)).toBe(0);
    expect(await stock(two.seller.productId)).toBe(100);
  });
  test("a partial decline removes only the declined items and the order can still be scanned afterwards", async () => {
    const { buyer, seller, id } = await arrived();
    const [item] = await pg.select().from(schema.ordered_items).where(eq(schema.ordered_items.ordersId, id));
    await createPickupDecline(buyer, id, { reason: "spoiled", photo: photo(9), items: JSON.stringify([{ itemId: item!.id, quantity: 4 }]) });
    expect((await fail(scanSellerOrder(seller.id, { qrPayload: await qr(id, seller.id) }))).message).toContain("Answer the decline");
    await respondToDecline(seller.id, id, { action: "accept" });
    const [after] = await pg.select().from(schema.ordered_items).where(eq(schema.ordered_items.ordersId, id));
    expect(Number(after!.quantity)).toBe(6);
    expect((await orderRow(id)).status).toBe("pending");
    expect(await stock(seller.productId)).toBe(90);
    await scanSellerOrder(seller.id, { qrPayload: await qr(id, seller.id) });
    expect((await orderRow(id)).status).toBe("completed");
    expect(await points(seller.id)).toBe(2);
  });
  test("declining needs a fresh photo and only works inside the pickup time", async () => {
    const { buyer, id } = await arrived();
    expect((await fail(createPickupDecline(buyer, id, { reason: "spoiled", photo: photo(1), capturedAt: new Date(Date.now() - HOUR).toISOString() }))).statusCode).toBe(400);
    const buyer2 = await addUser("buyer"); const seller2 = await addSeller();
    const early = await reserve(buyer2, seller2);
    expect((await fail(createPickupDecline(buyer2, early, { reason: "spoiled", photo: photo(2) }))).statusCode).toBe(409);
  });
});

describe("no-show, excuse and reschedule", () => {
  async function expired(buyer: string, seller: { id: string; productId: string }, from = 10) {
    const id = await reserve(buyer, seller, from, from + 1);
    await pg.update(schema.orders).set({ expiresAt: new Date(Date.now() - 1000), pickupEnd: new Date(Date.now() - 16 * 60_000) }).where(eq(schema.orders.id, id));
    await expirePendingOrders();
    return id;
  }
  test("every no-show adds 2 points and old ones fade after 90 days", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    await markOrderNoShow(seller.id, await expired(buyer, seller, 8));
    expect(await points(buyer)).toBe(2);
    const [first] = await pg.select().from(schema.buyer_no_shows);
    expect([first!.sequence, first!.weight]).toEqual([1, 2]);
    await markOrderNoShow(seller.id, await expired(buyer, seller, 10));
    expect(await points(buyer)).toBe(4);
    await pg.update(schema.trust_events).set({ createdAt: new Date(Date.now() - 100 * DAY) });
    expect(await points(buyer)).toBe(0);
    await markOrderNoShow(seller.id, await expired(buyer, seller, 12));
    expect(await points(buyer)).toBe(2);
  });
  test("a no-show cannot be marked before the QR time is over, or twice", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const early = await reserve(buyer, seller);
    expect((await fail(markOrderNoShow(seller.id, early))).statusCode).toBe(409);
    const id = await expired(buyer, seller, 12);
    await markOrderNoShow(seller.id, id);
    expect((await fail(markOrderNoShow(seller.id, id))).statusCode).toBe(409);
  });
  test("if the seller does not mark it, the system records it after an hour", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await expired(buyer, seller);
    await expirePendingOrders();
    expect(await recordUnmarkedNoShows()).toBe(0);
    await pg.update(schema.orders).set({ expiredAt: new Date(Date.now() - 2 * HOUR) }).where(eq(schema.orders.id, id));
    expect(await recordUnmarkedNoShows()).toBe(1);
    expect(await recordUnmarkedNoShows()).toBe(0);
  });
  test("a confirmed excuse removes the points; once per 30 days; 24-hour window", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    await markOrderNoShow(seller.id, await expired(buyer, seller, 8));
    const second = await expired(buyer, seller, 10);
    await markOrderNoShow(seller.id, second);
    expect(await points(buyer)).toBe(4);
    await createOrderExcuse(buyer, second, { reason: "rain" });
    await decideOrderExcuse(seller.id, second, true);
    expect(await points(buyer)).toBe(2);
    const third = await expired(buyer, seller, 12);
    expect((await fail(createOrderExcuse(buyer, third, { reason: "sick" }))).message).toContain("every 30 days");
    expect((await fail(decideOrderExcuse(seller.id, second, false))).statusCode).toBe(409);
    const old = await expired(await addUser("buyer"), seller, 14);
    await pg.update(schema.orders).set({ expiredAt: new Date(Date.now() - 25 * HOUR) }).where(eq(schema.orders.id, old));
    const oldOrder = await orderRow(old);
    expect((await fail(createOrderExcuse(oldOrder.buyersId, old, { reason: "rain" }))).statusCode).toBe(410);
  });
  test("a rejected excuse keeps the points", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    await markOrderNoShow(seller.id, await expired(buyer, seller, 8));
    const id = await expired(buyer, seller, 10);
    await markOrderNoShow(seller.id, id);
    await createOrderExcuse(buyer, id, { reason: "other", details: "My ride broke down" });
    await decideOrderExcuse(seller.id, id, false);
    expect(await points(buyer)).toBe(4);
  });
  test("a new time changes nothing until the buyer accepts, then the QR window moves", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller, 10, 11);
    await proposeReschedule(seller.id, id, { ...range(14, 15), reason: "Heavy rain at the market" });
    expect((await orderRow(id)).pickupStart).toEqual(tomorrow(10));
    await respondToReschedule(buyer, id, true);
    const moved = await orderRow(id);
    expect(moved.pickupStart).toEqual(tomorrow(14));
    expect(moved.expiresAt).toEqual(new Date(tomorrow(15).getTime() + 15 * 60_000));
    const [log] = await pg.select().from(schema.order_reschedules);
    expect([log!.status, log!.oldStart]).toEqual(["accepted", tomorrow(10)]);
  });
  test("a rejected new time keeps the old pickup, and a second offer cannot wait at once", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller, 10, 11);
    await proposeReschedule(seller.id, id, { ...range(14, 15), reason: "Road closed today" });
    expect((await fail(proposeReschedule(seller.id, id, { ...range(15, 16), reason: "Another change" }))).statusCode).toBe(409);
    await respondToReschedule(buyer, id, false);
    expect((await orderRow(id)).pickupStart).toEqual(tomorrow(10));
  });
});

describe("trust levels, fault gate and recalculation", () => {
  async function addEvents(subject: string, kind: string, count: number, weight: number, ageDays = 0) {
    for (let i = 0; i < count; i++) await pg.insert(schema.trust_events).values({ eventKey: `${kind}:${subject}:${i}:${ageDays}:${seq++}`, subjectId: subject, kind, classification: "verified", weight, createdAt: new Date(Date.now() - ageDays * DAY) });
  }
  const active = async (id: string) => (await pg.select().from(schema.trust_actions).where(eq(schema.trust_actions.subjectId, id))).filter((a) => !a.revokedAt);
  test("a buyer climbs the ladder and the same level is never applied twice", async () => {
    const buyer = await addUser("buyer");
    await addEvents(buyer, "buyer_late_cancellation", 2, 1); await evaluateTrustAction(buyer);
    expect((await active(buyer)).map((a) => a.level)).toEqual(["notice"]);
    await addEvents(buyer, "buyer_late_cancellation", 2, 1); await evaluateTrustAction(buyer);
    await evaluateTrustAction(buyer);
    expect((await active(buyer)).map((a) => a.level).sort()).toEqual(["notice", "warning"]);
    await addEvents(buyer, "buyer_failed_reservation", 1, 2); await evaluateTrustAction(buyer);
    const pause = (await active(buyer)).find((a) => a.level === "pause_24h")!;
    expect(pause.endsAt!.getTime() - pause.startsAt.getTime()).toBe(24 * HOUR);
    await evaluateTrustAction(buyer);
    expect((await pg.select().from(schema.trust_actions).where(eq(schema.trust_actions.level, "pause_24h")))).toHaveLength(1);
    await addEvents(buyer, "buyer_failed_reservation", 1, 2); await evaluateTrustAction(buyer);
    expect((await active(buyer)).some((a) => a.level === "pause_3d")).toBe(true);
    await addEvents(buyer, "buyer_failed_reservation", 2, 2); await evaluateTrustAction(buyer);
    expect((await active(buyer)).some((a) => a.level === "block")).toBe(true);
    expect((await pg.select().from(schema.user).where(eq(schema.user.id, buyer)))[0]!.isActive).toBe(false);
  });
  test("a seller with a high score but a low fault rate stays at Warning and Under watch", async () => {
    const seller = (await addSeller()).id;
    await addEvents(seller, "inquiry_non_response", 12, 1);
    await evaluateTrustAction(seller);
    expect((await active(seller)).map((a) => a.level)).toEqual(["warning"]);
    expect((await readTrustStanding(seller)).underWatch).toBe(true);
    expect((await pg.select().from(schema.seller_flags).where(eq(schema.seller_flags.kind, "under_watch")))).toHaveLength(1);
  });
  test("with 10 orders and a fault rate of 10% the seller is paused", async () => {
    const seller = (await addSeller()).id; const buyer = await addUser("buyer");
    for (let i = 0; i < 9; i++) await pg.insert(schema.orders).values({ buyersId: buyer, sellersId: seller, status: "completed", totalAmount: "1", completedAt: new Date() });
    await addEvents(seller, "seller_cancellation", 1, 2);
    await pg.insert(schema.orders).values({ buyersId: buyer, sellersId: seller, status: "cancelled", cancelledBy: "seller", totalAmount: "1", cancelledAt: new Date() });
    await addEvents(seller, "inquiry_non_response", 4, 1);
    const standing = await readTrustStanding(seller);
    expect([standing.fault!.orderCount, Math.round(standing.fault!.ratePercent)]).toEqual([10, 10]);
    expect(standing.level).toBe("pause_24h");
    expect(standing.canList).toBe(false); expect(standing.canBoost).toBe(false);
  });
  test("a seller at 15% or more is flagged High fault rate and cannot use Priority Boost, with 0 extra points", async () => {
    const seller = (await addSeller()).id; const buyer = await addUser("buyer");
    for (let i = 0; i < 8; i++) await pg.insert(schema.orders).values({ buyersId: buyer, sellersId: seller, status: "completed", totalAmount: "1", completedAt: new Date() });
    for (let i = 0; i < 2; i++) await pg.insert(schema.orders).values({ buyersId: buyer, sellersId: seller, status: "cancelled", cancelledBy: "seller", totalAmount: "1", cancelledAt: new Date() });
    await addEvents(seller, "seller_cancellation", 2, 2);
    const standing = await readTrustStanding(seller);
    expect(standing.needsReview).toBe(true); expect(standing.canBoost).toBe(false); expect(standing.score).toBe(4);
    await evaluateTrustAction(seller);
    expect((await pg.select().from(schema.seller_flags).where(eq(schema.seller_flags.kind, "needs_review")))).toHaveLength(1);
  });
  test("5 confirmed seller-fault returns flag the seller for review; 4 do not", async () => {
    const seller = await addSeller(); const buyer = await addUser("buyer");
    const make = async () => {
      const [o] = await pg.insert(schema.orders).values({ buyersId: buyer, sellersId: seller.id, status: "declined", totalAmount: "1" }).returning();
      await pg.insert(schema.order_declines).values({ orderId: o!.id, buyerId: buyer, sellerId: seller.id, reason: "spoiled", reasonValid: true, items: [], isFull: true, photoKey: "k", photoHash: `h${seq++}`, sellerDueAt: new Date(), status: "seller_fault", decidedAt: new Date() });
    };
    for (let i = 0; i < 4; i++) await make();
    await evaluateTrustAction(seller.id);
    expect(await pg.select().from(schema.seller_flags).where(eq(schema.seller_flags.kind, "repeat_returns"))).toHaveLength(0);
    await make(); await evaluateTrustAction(seller.id);
    expect(await pg.select().from(schema.seller_flags).where(eq(schema.seller_flags.kind, "repeat_returns"))).toHaveLength(1);
  });
  test("points leave after exactly 90 days and the level comes down without a new penalty", async () => {
    const buyer = await addUser("buyer");
    await addEvents(buyer, "buyer_failed_reservation", 3, 2);
    await evaluateTrustAction(buyer);
    expect((await active(buyer)).some((a) => a.level === "pause_24h")).toBe(true);
    await pg.update(schema.trust_events).set({ createdAt: new Date(Date.now() - 91 * DAY) });
    expect(await points(buyer)).toBe(0);
    const { revoked } = await recalculateTrustStanding(buyer, "Old points faded");
    expect(revoked).toBeGreaterThan(0);
    expect(await active(buyer)).toHaveLength(0);
    expect((await pg.select().from(schema.trust_actions)).length).toBeGreaterThan(0);
  });
  test("an event 89 days old still counts", async () => {
    const buyer = await addUser("buyer");
    await addEvents(buyer, "buyer_failed_reservation", 1, 2, 89);
    expect(await points(buyer)).toBe(2);
  });
  test("QR misuse confirmed blocks at once, even for a seller under the fault gate", async () => {
    const seller = (await addSeller()).id;
    await addEvents(seller, "qr_misuse", 1, 3);
    await evaluateTrustAction(seller);
    expect((await active(seller)).some((a) => a.level === "block")).toBe(true);
  });
});

describe("reports and disputes", () => {
  async function orderWith(buyer: string, seller: { id: string; productId: string }, from: number) {
    const id = await reserve(buyer, seller, from, from + 1);
    return id;
  }
  test("one report is an allegation worth 0 points; two different people confirm it for +2", async () => {
    const seller = await addSeller(); const [b1, b2] = [await addUser("buyer"), await addUser("buyer")];
    await createOrderReport(b1, await orderWith(b1, seller, 8), "buyer", "listing_inaccurate", "I asked for 2 kg and got only 1 kg of tomatoes");
    expect(await points(seller.id)).toBe(0);
    await createOrderReport(b2, await orderWith(b2, seller, 10), "buyer", "listing_inaccurate", "Weight was much lower than the listing said");
    expect(await points(seller.id)).toBe(2);
    const statuses = (await pg.select().from(schema.order_reports)).map((r) => r.status);
    expect(statuses).toEqual(["confirmed", "confirmed"]);
  });
  test("details need 20 characters, one report per order, and 'other' never confirms", async () => {
    const seller = await addSeller(); const b1 = await addUser("buyer");
    const order = await orderWith(b1, seller, 8);
    expect((await fail(createOrderReport(b1, order, "buyer", "conduct", "too short"))).statusCode).toBe(400);
    await createOrderReport(b1, order, "buyer", "other", "This is a long enough explanation");
    expect((await fail(createOrderReport(b1, order, "buyer", "other", "This is a long enough explanation"))).statusCode).toBe(409);
  });
  test("a report is set aside while the reported person has an open report against the reporter on the same order", async () => {
    const seller = await addSeller(); const buyer = await addUser("buyer");
    const order = await orderWith(buyer, seller, 8);
    await createOrderReport(seller.id, order, "seller", "conduct", "The buyer was rude and shouted at my staff");
    await createOrderReport(buyer, order, "buyer", "conduct", "The seller was rude to me during the pickup");
    const rows = await pg.select().from(schema.order_reports);
    expect(rows.find((r) => r.reporterId === buyer)!.resolution).toBe("ignored_reciprocal");
  });
  test("the same pair cannot confirm a third time alone; only a third reporter can confirm", async () => {
    const seller = await addSeller(); const [b1, b2, b3] = [await addUser("buyer"), await addUser("buyer"), await addUser("buyer")];
    for (let round = 0; round < 3; round++) {
      await createOrderReport(b1, await orderWith(b1, seller, 6 + round * 4), "buyer", "conduct", `Round ${round}: the seller was rude to me`);
      await createOrderReport(b2, await orderWith(b2, seller, 7 + round * 4), "buyer", "conduct", `Round ${round}: the seller shouted at me`);
    }
    expect(await points(seller.id)).toBe(4);
    const statuses = (await pg.select().from(schema.order_reports)).map((r) => r.status);
    expect(statuses.filter((s) => s === "pending_corroboration")).toHaveLength(2);
    await createOrderReport(b3, await orderWith(b3, seller, 18), "buyer", "conduct", "A third person saw the same rude behaviour");
    expect(await points(seller.id)).toBe(6);
  });
  test("a dispute within 7 days is upheld by the system when the record disagrees: event removed, levels recalculated", async () => {
    const seller = (await addSeller()).id;
    const [event] = await pg.insert(schema.trust_events).values({ eventKey: "e1", subjectId: seller, kind: "seller_cancellation", classification: "verified", weight: 2 }).returning();
    await pg.insert(schema.trust_events).values({ eventKey: "e2", subjectId: seller, kind: "seller_cancellation", classification: "verified", weight: 2 });
    await evaluateTrustAction(seller);
    expect((await readTrustStanding(seller)).level).toBe("warning");
    const dispute = await createTrustDispute(seller, event!.id, { reason: "The buyer asked me to cancel the order" });
    expect(dispute.result).toBe("upheld");
    expect(await points(seller)).toBe(2);
    expect((await pg.select().from(schema.trust_actions).where(eq(schema.trust_actions.level, "warning")))[0]!.revokedAt).not.toBeNull();
    expect((await fail(createTrustDispute(seller, event!.id, { reason: "The buyer asked me to cancel the order" }))).statusCode).toBe(409);
  });
  test("a dispute works at exactly 7 days and not after", async () => {
    const seller = (await addSeller()).id;
    const [fresh] = await pg.insert(schema.trust_events).values({ eventKey: "d7", subjectId: seller, kind: "seller_cancellation", classification: "verified", weight: 2, createdAt: new Date(Date.now() - 7 * DAY + 1000) }).returning();
    await createTrustDispute(seller, fresh!.id, { reason: "This was not my fault at all" });
    const [late] = await pg.insert(schema.trust_events).values({ eventKey: "d8", subjectId: seller, kind: "seller_cancellation", classification: "verified", weight: 2, createdAt: new Date(Date.now() - 7 * DAY - 1000) }).returning();
    expect((await fail(createTrustDispute(seller, late!.id, { reason: "This was not my fault at all" }))).statusCode).toBe(410);
  });
  test("a dispute the records contradict is rejected; one with no record to check stays unresolved; another person's event cannot be disputed", async () => {
    const [seller, other] = [await addSeller(), await addSeller()]; const buyer = await addUser("buyer");
    const order = await orderWith(buyer, seller, 6);
    await pg.update(schema.orders).set({ status: "cancelled", cancelledBy: seller.id, confirmedAt: new Date(), cancelledAt: new Date() }).where(eq(schema.orders.id, order));
    const [event] = await pg.insert(schema.trust_events).values({ eventKey: "r1", subjectId: seller.id, orderId: order, kind: "seller_cancellation", classification: "verified", weight: 2 }).returning();
    expect((await fail(createTrustDispute(other.id, event!.id, { reason: "This is not even mine to dispute" }))).statusCode).toBe(404);
    const dispute = await createTrustDispute(seller.id, event!.id, { reason: "Please look at this again carefully" });
    expect(dispute.result).toBe("rejected");
    expect(await points(seller.id)).toBe(2);
    const [report] = await pg.insert(schema.trust_events).values({ eventKey: "r2", subjectId: seller.id, kind: "inappropriate_communication", classification: "verified", weight: 2 }).returning();
    const open = await createTrustDispute(seller.id, report!.id, { reason: "That never happened, I was not there" });
    expect(open.result).toBe("unresolved");
    expect(await points(seller.id)).toBe(4);
  });
});

describe("Away mode", () => {
  test("Away stops the 48-hour clock, lasts at most 14 days and leaves orders alone", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller);
    const stall = await setAway(seller.id, { away: true, days: 14, reason: "Harvest" });
    expect(stall.away.active).toBe(true);
    expect((await orderRow(id)).status).toBe("pending");
    expect((await fail(setAway(seller.id, { away: true }))).statusCode).toBe(409);
    const until = stall.away.until!.getTime();
    expect(until - Date.now()).toBeLessThanOrEqual(14 * DAY);
    await pg.insert(schema.order_inquiries).values({ orderId: id, buyerId: buyer, sellerId: seller.id, question: "Is it fresh?", createdAt: new Date(Date.now() - 49 * HOUR) });
    await processInquiryDeadlines();
    expect(await points(seller.id)).toBe(0);
    await setAway(seller.id, { away: false });
    expect((await readStall(seller.id)).away.active).toBe(false);
  });
  test("time spent Away does not count; the remaining wait still can", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller);
    await pg.insert(schema.seller_away_periods).values({ sellerId: seller.id, startedAt: new Date(Date.now() - 40 * HOUR), endedAt: new Date(Date.now() - 2 * HOUR) });
    await pg.insert(schema.order_inquiries).values({ orderId: id, buyerId: buyer, sellerId: seller.id, question: "Is it fresh?", createdAt: new Date(Date.now() - 49 * HOUR) });
    await processInquiryDeadlines();
    expect(await points(seller.id)).toBe(0);
    await pg.update(schema.seller_away_periods).set({ startedAt: new Date(Date.now() - 10 * HOUR), endedAt: new Date(Date.now() - 2 * HOUR) });
    await pg.update(schema.order_inquiries).set({ createdAt: new Date(Date.now() - 60 * HOUR) });
    await processInquiryDeadlines();
    expect(await points(seller.id)).toBe(1);
  });
  test("a reply at 47 hours is never flagged", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller);
    await pg.insert(schema.order_inquiries).values({ orderId: id, buyerId: buyer, sellerId: seller.id, question: "Is it fresh?", createdAt: new Date(Date.now() - 47 * HOUR) });
    await processInquiryDeadlines();
    expect(await points(seller.id)).toBe(0);
    const notices = (await pg.select().from(schema.trust_notices)).map((n) => n.kind);
    expect(notices).toEqual(expect.arrayContaining(["inquiry_12h_reminder", "inquiry_24h_warning"]));
  });
});

describe("seller reply deadlines (FTM-03 to FTM-05)", () => {
  const kinds = async () => (await pg.select().from(schema.trust_notices)).map((n) => n.kind).filter((kind) => kind.startsWith("inquiry"));
  async function ask(hoursAgo: number) {
    const buyer = await addUser("buyer"); const seller = await addSeller();
    const id = await reserve(buyer, seller);
    await pg.insert(schema.order_inquiries).values({ orderId: id, buyerId: buyer, sellerId: seller.id, question: "Is it fresh?", createdAt: new Date(Date.now() - hoursAgo * HOUR) });
    await processInquiryDeadlines();
    return seller.id;
  }
  test("FTM-03 after 12 hours the seller gets a reminder and no points", async () => {
    const seller = await ask(13);
    expect(await kinds()).toEqual(["inquiry_12h_reminder"]);
    expect(await points(seller)).toBe(0);
  });
  test("FTM-04 after 24 hours the seller gets a warning and the buyer is told, with no points yet", async () => {
    const seller = await ask(25);
    expect(await kinds()).toEqual(expect.arrayContaining(["inquiry_12h_reminder", "inquiry_24h_warning", "inquiry_24h_buyer_notice"]));
    expect(await points(seller)).toBe(0);
  });
  test("FTM-05 after 48 hours the seller is marked non-responsive and gets 1 point, once", async () => {
    const seller = await ask(49);
    expect(await points(seller)).toBe(1);
    await processInquiryDeadlines();
    expect(await points(seller)).toBe(1);
    const events = await pg.select().from(schema.trust_events).where(eq(schema.trust_events.subjectId, seller));
    expect(events.map((e) => [e.kind, e.classification])).toEqual([["inquiry_non_response", "verified"]]);
  });
  test("FTM-01 a seller with no violations has 0 points and no action", async () => {
    const seller = (await addSeller()).id;
    expect(await points(seller)).toBe(0);
    expect((await readTrustStanding(seller)).level).toBe("good");
  });
});

describe("Flagging Rules Without Admin", () => {
  test("an order from the seller's own account is refused, adds 3 points and blocks the account at once", async () => {
    const seller = await addSeller();
    expect((await fail(reserve(seller.id, seller))).statusCode).toBe(403);
    expect(await points(seller.id)).toBe(3);
    const [account] = await pg.select().from(schema.user).where(eq(schema.user.id, seller.id));
    expect(account!.isActive).toBe(false);
    expect(await stock(seller.productId)).toBe(100);
  });
  test("more than 5 orders in 7 days from one buyer: extra orders add 0 points and leave the counts", async () => {
    const buyer = await addUser("buyer"); const seller = await addSeller({ capacity: 10 });
    const ids: string[] = [];
    for (let hour = 8; hour <= 13; hour++) ids.push(await reserve(buyer, seller, hour, hour + 1, 1));
    const flags = await Promise.all(ids.map(async (id) => (await orderRow(id)).countsForRanking));
    expect(flags).toEqual([true, true, true, true, true, false]);
    expect([await points(buyer), await points(seller.id)]).toEqual([0, 0]);
  });
  test("3 reports in 14 days with none confirmed add 1 point to the reporter", async () => {
    const buyer = await addUser("buyer");
    for (let i = 0; i < 3; i++) {
      const seller = await addSeller();
      const id = await reserve(buyer, seller, 8 + i, 9 + i, 1);
      await createOrderReport(buyer, id, "buyer", "pickup_problem", "The produce did not look like the photo at all.");
      expect(await points(buyer)).toBe(i === 2 ? 1 : 0);
    }
  });
  test("review bomb: 5 low ratings from accounts under 7 days old in 24 hours are ignored, buyers get 0 points and a notice", async () => {
    const seller = await addSeller({ capacity: 10 });
    const buyers: string[] = [];
    for (let i = 0; i < 5; i++) {
      const buyer = await addUser("buyer"); buyers.push(buyer);
      const id = await reserve(buyer, seller, 8 + i, 9 + i, 1);
      await pg.update(schema.orders).set({ status: "completed", completedAt: new Date() }).where(eq(schema.orders.id, id));
      await createBuyerReview(buyer, id, { serviceRating: 1, productRating: 1, review: "Very bad produce" });
      expect(await points(seller.id)).toBe(i < 4 ? i + 1 : 0);
    }
    expect((await readSellerRating(seller.id)).count).toBe(0);
    expect((await pg.select().from(schema.order_reviews).where(sql`ignored_at is not null`)).length).toBe(5);
    expect(await points(buyers[0]!)).toBe(0);
    expect((await pg.select().from(schema.trust_notices)).filter((n) => n.noticeKey.startsWith("review-bomb:"))).toHaveLength(5);
  });
  test("review bomb: older accounts are never ignored", async () => {
    const seller = await addSeller({ capacity: 10 });
    for (let i = 0; i < 5; i++) {
      const buyer = await addUser("buyer");
      await pg.update(schema.user).set({ createdAt: new Date(Date.now() - 30 * DAY) }).where(eq(schema.user.id, buyer));
      const id = await reserve(buyer, seller, 8 + i, 9 + i, 1);
      await pg.update(schema.orders).set({ status: "completed", completedAt: new Date() }).where(eq(schema.orders.id, id));
      await createBuyerReview(buyer, id, { serviceRating: 2, productRating: 2, review: "Not good" });
    }
    expect((await readSellerRating(seller.id)).count).toBe(5);
    expect(await points(seller.id)).toBe(5);
  });
  test("chat: a phone number or email hides the message; the 3rd one in 90 days adds 1 point", async () => {
    const user = await addUser("buyer");
    for (let i = 1; i <= 3; i++) {
      expect((await screenChatMessage(user, i === 1 ? "call 0917 123 4567" : i === 2 ? "me@mail.com" : "+63 917 123 4567", `c${i}`)).hidden).toBe(true);
      expect(await points(user)).toBe(i === 3 ? 1 : 0);
    }
    expect((await screenChatMessage(user, "How much for 2 kilos?", "c9")).hidden).toBe(false);
  });
  test("chat: the same message 5 times in 10 minutes pauses sending for 10 minutes; the 2nd time in 90 days adds 1 point", async () => {
    const buyer = await addUser("buyer"); const seller = await addUser("seller");
    const [conversation] = await pg.insert(schema.conversations).values({ contextType: "seller", contextKey: `k${seq}`, buyerId: buyer, sellerId: seller }).returning();
    const send = (n: number) => pg.insert(schema.conversation_messages).values(Array.from({ length: n }, (_, i) => ({ conversationId: conversation!.id, senderId: buyer, clientMessageId: `m${seq++}-${i}`, body: "Hello?" })));
    await send(4);
    expect((await fail(screenChatMessage(buyer, "Hello?", "s1"))) instanceof ChatRuleError).toBe(true);
    expect(await points(buyer)).toBe(0);
    const paused = await fail(screenChatMessage(buyer, "Something else", "s2"));
    expect(paused.statusCode).toBe(429); expect(paused.message).toContain("minute");
    await pg.update(schema.trust_events).set({ createdAt: new Date(Date.now() - 11 * 60_000) }).where(eq(schema.trust_events.kind, "chat_spam"));
    await pg.update(schema.conversation_messages).set({ createdAt: new Date(Date.now() - 30 * 60_000) });
    expect((await screenChatMessage(buyer, "Something else", "s3")).hidden).toBe(false);
    await send(4);
    await fail(screenChatMessage(buyer, "Hello?", "s4"));
    expect(await points(buyer)).toBe(1);
  });
});

void [and, recordTrustEvent];
