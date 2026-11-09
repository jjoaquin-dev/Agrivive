import { beforeAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api-postgres";
import { sql } from "drizzle-orm";
import * as schema from "../../../db/schema";

// These cases check the numbers and the template text, so never call Groq from here.
process.env.GROQ_API_KEY = "";
const pg = drizzle({ client: new PGlite() });
mock.module(`${import.meta.dir}/../../../db/index.ts`, () => ({ db: pg }));
// Another test file replaces the seller-access guard for the whole run, so load the real one under another name and put it back here.
const realPath = "../../../utils/seller-access/index.ts?real";
const realSellerAccess = await import(realPath);
mock.module(`${import.meta.dir}/../../../utils/seller-access/index.ts`, () => realSellerAccess);
const { getSellerAnalytics } = await import("./seller.analytics");

// One test per case in the Descriptive Sales Trend Analytics sheet (DSA-01 to DSA-18). Dates are in October 2026, UTC days.
let seq = 0;
const at = (day: number, hour = 6) => new Date(Date.UTC(2026, 9, day, hour));
const sep = (day: number) => new Date(Date.UTC(2026, 8, day, 6));
const fail = async (p: Promise<unknown>) => { try { await p; } catch (e) { return e as { statusCode: number; message: string }; } throw new Error("expected an error"); };
const range = { from: "2026-10-01", to: "2026-10-05" };

async function addSeller(opts: { verified?: boolean } = {}) {
  const id = `s${++seq}`;
  await pg.insert(schema.user).values({ id, name: id, email: `${id}@t.dev`, role: ["seller"], emailVerified: opts.verified ?? true });
  await pg.insert(schema.sellers_profile).values({ userId: id, shopName: `Stall ${id}`, detailAddress: "Market Rd", phoneNumber: "09171234567", latitude: 14.6, longitude: 121 });
  return id;
}
async function addBuyer() {
  const id = `b${++seq}`;
  await pg.insert(schema.user).values({ id, name: id, email: `${id}@t.dev`, role: ["buyer"], emailVerified: true });
  return id;
}
async function addProduct(sellerId: string, name = "Tomato", unit: "kilo" | "sack" | "pile" = "kilo", qty = "10") {
  const [p] = await pg.insert(schema.sellers_product).values({ userId: sellerId, productName: name, productType: "Leafy Greens", scalingType: unit, productPrice: "50", productQty: qty, originalQty: qty }).returning();
  return p!.id;
}
const cycle = (productId: string, startedAt: Date, qty: string, key = "tomato", unit: "kilo" | "sack" | "pile" = "kilo") =>
  pg.insert(schema.listing_cycles).values({ productId, scalingType: unit, vegetableKey: key, originalQty: qty, startedAt });
async function sale(sellerId: string, productId: string, qty: string, total: string, status: "completed" | "pending" | "cancelled" | "expired", when: Date, buyerId?: string) {
  const buyer = buyerId ?? await addBuyer();
  const [o] = await pg.insert(schema.orders).values({
    buyersId: buyer, sellersId: sellerId, status, totalAmount: total, createdAt: when,
    completedAt: status === "completed" ? when : null, cancelledAt: status === "cancelled" ? when : null, expiredAt: status === "expired" ? when : null,
  }).returning();
  await pg.insert(schema.ordered_items).values({ ordersId: o!.id, productId, quantity: qty, unitPrice: (Number(total) / Number(qty)).toFixed(2), subtotal: total });
  return o!.id;
}

beforeAll(async () => { await (await pushSchema(schema as never, pg as never)).apply(); });
beforeEach(async () => { await pg.execute(sql`truncate table "user" cascade`); });

describe("Descriptive Sales Trend Analytics", () => {
  test("DSA-01 with no dates the report covers the last 30 days and compares with the 30 days before", async () => {
    const s = await addSeller();
    const r = await getSellerAnalytics(s, {});
    const days = (a: string, b: string) => (Date.parse(b) - Date.parse(a)) / 86_400_000 + 1;
    expect(days(r.period.from, r.period.to)).toBe(30);
    expect(days(r.period.previousFrom, r.period.previousTo)).toBe(30);
    expect(Date.parse(r.period.to) - Date.parse(r.period.previousTo)).toBe(30 * 86_400_000);
  });
  test("DSA-02 a custom range includes both end days and the previous period is the same length right before it", async () => {
    const s = await addSeller();
    const r = await getSellerAnalytics(s, range);
    expect([r.period.from, r.period.to]).toEqual(["2026-10-01", "2026-10-05"]);
    expect([r.period.previousFrom, r.period.previousTo]).toEqual(["2026-09-26", "2026-09-30"]);
  });
  test("DSA-03 a missing, reversed or badly written date is refused", async () => {
    const s = await addSeller();
    expect((await fail(getSellerAnalytics(s, { from: "2026-10-01" }))).statusCode).toBe(400);
    expect((await fail(getSellerAnalytics(s, { from: "2026-10-05", to: "2026-10-01" }))).statusCode).toBe(400);
    expect((await fail(getSellerAnalytics(s, { from: "2026-13-40", to: "2026-10-01" }))).statusCode).toBe(400);
  });
  test("DSA-04 posted quantity adds the listings posted inside the days only (50 + 40 + 30 = 120 kg)", async () => {
    const s = await addSeller(); const p = await addProduct(s);
    await cycle(p, at(1), "50"); await cycle(p, at(2), "40"); await cycle(p, at(4), "30");
    await cycle(p, at(20), "99"); await cycle(p, sep(20), "77");
    expect((await getSellerAnalytics(s, range)).metrics.postedQuantity).toBe("120.00");
  });
  test("DSA-05 sold quantity counts only completed pickups inside the days (20 + 25 + 15 = 60 kg)", async () => {
    const s = await addSeller(); const p = await addProduct(s);
    await sale(s, p, "20", "400", "completed", at(1)); await sale(s, p, "25", "500", "completed", at(2)); await sale(s, p, "15", "300", "completed", at(4));
    await sale(s, p, "9", "90", "pending", at(3)); await sale(s, p, "8", "80", "cancelled", at(3)); await sale(s, p, "7", "70", "completed", at(20));
    expect((await getSellerAnalytics(s, range)).metrics.completedQuantity).toBe("60.00");
  });
  test("DSA-06 sell-through is sold divided by posted: 60 of 120 kg is 50%", async () => {
    const s = await addSeller(); const p = await addProduct(s);
    await cycle(p, at(1), "120");
    await sale(s, p, "60", "1200", "completed", at(2));
    const r = await getSellerAnalytics(s, range);
    expect(r.metrics.sellThroughRate).toBe(50);
    expect(r.notComputable.sellThroughRate).toBe(false);
  });
  test("DSA-07 nothing posted gives no sell-through instead of dividing by zero, and the summary says so", async () => {
    const s = await addSeller(); const p = await addProduct(s);
    await sale(s, p, "5", "50", "completed", at(2));
    const r = await getSellerAnalytics(s, range);
    expect(r.metrics.sellThroughRate).toBeNull();
    expect(r.notComputable.sellThroughRate).toBe(true);
    expect(r.summary).toContain("Sell-through could not be calculated");
  });
  test("DSA-08 the pesos total adds the completed pickups only", async () => {
    const s = await addSeller(); const p = await addProduct(s);
    await sale(s, p, "20", "400", "completed", at(1)); await sale(s, p, "5", "125.50", "completed", at(2)); await sale(s, p, "9", "900", "cancelled", at(2));
    const r = await getSellerAnalytics(s, range);
    expect(r.metrics.completedSalesTotal).toBe("525.50");
    expect(r.insights.totalSales).toBe(525.5);
  });
  test("DSA-09 sales trend is the change from the previous period: 40 kg before and 60 kg now is +50%", async () => {
    const s = await addSeller(); const p = await addProduct(s);
    await sale(s, p, "40", "400", "completed", sep(28)); await sale(s, p, "60", "600", "completed", at(3));
    const r = await getSellerAnalytics(s, range);
    expect(r.metrics.completedQuantityChange).toBe(50);
    expect(r.summary).toContain("increased by 50.00%");
  });
  test("DSA-10 a drop shows as negative, and no sales before gives no percentage instead of dividing by zero", async () => {
    const s = await addSeller(); const p = await addProduct(s);
    await sale(s, p, "60", "600", "completed", sep(28)); await sale(s, p, "30", "300", "completed", at(3));
    const down = await getSellerAnalytics(s, range);
    expect(down.metrics.completedQuantityChange).toBe(-50);
    expect(down.summary).toContain("decreased by 50.00%");
    const t = await addSeller(); const q = await addProduct(t);
    await sale(t, q, "30", "300", "completed", at(3));
    const fresh = await getSellerAnalytics(t, range);
    expect(fresh.metrics.completedQuantityChange).toBeNull();
    expect(fresh.notComputable.completedQuantityChange).toBe(true);
    expect(fresh.summary).toContain("could not be compared");
  });
  test("DSA-11 filtering by one product leaves out the seller's other products", async () => {
    const s = await addSeller(); const tomato = await addProduct(s, "Tomato"); const okra = await addProduct(s, "Okra");
    await cycle(tomato, at(1), "50", "tomato"); await cycle(okra, at(1), "99", "okra");
    await sale(s, tomato, "10", "100", "completed", at(2)); await sale(s, okra, "30", "300", "completed", at(2));
    const r = await getSellerAnalytics(s, { ...range, productId: tomato });
    expect([r.metrics.postedQuantity, r.metrics.completedQuantity, r.filter.productName]).toEqual(["50.00", "10.00", "Tomato"]);
  });
  test("DSA-12 filtering by unit leaves out the other units", async () => {
    const s = await addSeller(); const kilo = await addProduct(s, "Tomato", "kilo"); const sack = await addProduct(s, "Rice", "sack");
    await sale(s, kilo, "10", "100", "completed", at(2)); await sale(s, sack, "3", "900", "completed", at(2));
    const r = await getSellerAnalytics(s, { ...range, unit: "sack" });
    expect(r.metrics.completedQuantity).toBe("3.00");
    expect(r.filter.unit).toBe("sack");
  });
  test("DSA-13 reserved, cancelled, expired and still-open amounts are counted by their own dates", async () => {
    const s = await addSeller(); const p = await addProduct(s, "Tomato", "kilo", "10");
    await sale(s, p, "4", "40", "cancelled", at(2)); await sale(s, p, "3", "30", "expired", at(3)); await sale(s, p, "2", "20", "pending", at(4)); await sale(s, p, "6", "60", "completed", at(5));
    const m = (await getSellerAnalytics(s, range)).metrics;
    expect([m.reservedQuantity, m.cancelledQuantity, m.expiredQuantity, m.completedQuantity]).toEqual(["15.00", "4.00", "3.00", "6.00"]);
    expect(m.availableQuantity).toBe("10.00");
    expect(m.remainingQuantity).toBe("12.00");
  });
  test("DSA-14 posting the same vegetable and unit again counts as one repeat listing", async () => {
    const s = await addSeller(); const p = await addProduct(s);
    await cycle(p, sep(28), "10"); await cycle(p, at(2), "10"); await cycle(p, at(4), "10");
    expect((await getSellerAnalytics(s, range)).metrics.recurringListings).toBe(1);
  });
  test("DSA-15 another seller's orders and listings never appear", async () => {
    const s = await addSeller(); const other = await addSeller(); const p = await addProduct(s); const op = await addProduct(other);
    await cycle(op, at(1), "500"); await sale(other, op, "100", "1000", "completed", at(2));
    await sale(s, p, "5", "50", "completed", at(2));
    const m = (await getSellerAnalytics(s, range)).metrics;
    expect([m.postedQuantity, m.completedQuantity]).toEqual(["0.00", "5.00"]);
  });
  test("DSA-16 the extra figures: order counts, average and largest order, best sellers, returning buyers and a row for every day", async () => {
    const s = await addSeller(); const tomato = await addProduct(s, "Tomato"); const okra = await addProduct(s, "Okra");
    const repeat = await addBuyer();
    await sale(s, tomato, "10", "100", "completed", at(1), repeat); await sale(s, tomato, "10", "300", "completed", at(2), repeat);
    await sale(s, okra, "5", "50", "completed", at(3)); await sale(s, okra, "1", "10", "cancelled", at(3));
    const i = (await getSellerAnalytics(s, range)).insights;
    expect(i.orders).toMatchObject({ placed: 4, pickedUp: 3, cancelled: 1 });
    expect([i.averageOrder, i.smallestOrder, i.largestOrder, i.totalSales]).toEqual([150, 50, 300, 450]);
    expect(i.topProduce.map((t) => [t.name, t.sales])).toEqual([["Tomato", 400], ["Okra", 50]]);
    expect(i.buyers).toEqual({ total: 2, returning: 1 });
    expect(i.dailySales).toHaveLength(5);
    expect(i.dailySales.map((d) => d.pickups)).toEqual([1, 1, 1, 0, 0]);
  });
  test("DSA-17 a period with no sales says so in plain words and returns zeros", async () => {
    const s = await addSeller();
    const r = await getSellerAnalytics(s, range);
    expect(r.summary).toContain("No completed pickup sales were recorded from 2026-10-01 to 2026-10-05");
    expect([r.metrics.completedQuantity, r.metrics.completedSalesTotal]).toEqual(["0.00", "0.00"]);
    expect(r.insights.averageOrder).toBeNull();
  });
  test("DSA-18 an unverified seller, or an account that is not a seller, is refused", async () => {
    const unverified = await addSeller({ verified: false });
    expect((await fail(getSellerAnalytics(unverified, range))).statusCode).toBe(403);
    const buyer = await addBuyer();
    expect([401, 403, 404]).toContain((await fail(getSellerAnalytics(buyer, range))).statusCode);
  });
});
