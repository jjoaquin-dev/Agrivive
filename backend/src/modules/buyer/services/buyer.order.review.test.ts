import { beforeAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api-postgres";
import { eq, sql } from "drizzle-orm";
import { Elysia } from "elysia";
import * as schema from "../../../db/schema";

// An in-memory Postgres stands in for the real database. Nothing here touches Supabase or S3.
process.env.TRUST_ACTIONS_ENABLED = "false";
const pg = drizzle({ client: new PGlite() });
const here = import.meta.dir;
mock.module(`${here}/../../../db/index.ts`, () => ({ db: pg }));
const uploads: string[] = [];
mock.module(`${here}/../../../utils/s3/private-upload.ts`, () => ({
  uploadPrivateObject: async (p: { key: string }) => { uploads.push(p.key); return p.key; },
}));
mock.module(`${here}/../../../utils/s3/private-download.ts`, () => ({
  createPrivateDownloadUrl: async (key: string) => `https://signed.example/${key}`,
}));

const { createBuyerReview } = await import("./buyer.order.review.create");
const { trustPolicyWeights } = await import("../../../utils/trust/policy");
const { editBuyerReview } = await import("./buyer.order.review.edit");
const { setBuyerReviewPhoto } = await import("./buyer.order.review.photo");
const { readSellerRating } = await import("./buyer.seller.rating");
const { readOrderReview } = await import("../../../utils/trust/read-review");
const { readProductRatings } = await import("../../../utils/product-rating");
const { readTrustMonitoringScore } = await import("../../../utils/trust/score");
const { listMarketplaceProductReviews } = await import("../../marketplace/services/marketplace.product.reviews.list");
const { buyerReviewBody, buyerReviewEditBody } = await import("../model/buyer.order.review");
const { isReviewEditable, reviewEditDays, reviewEditDeadline } = await import("../../../utils/review-format");
const { OrderError } = await import("../../../utils/order-types");

const day = 86_400_000;
let seq = 0;
const id = () => crypto.randomUUID();

async function addUser(name: string) {
  const userId = `u-${++seq}`;
  await pg.insert(schema.user).values({ id: userId, name, email: `${userId}@test.dev` });
  return userId;
}
async function addProduct(sellerId: string, name: string) {
  const [row] = await pg.insert(schema.sellers_product).values({
    userId: sellerId, productName: name, productType: "Leafy Greens", scalingType: "kilo",
  }).returning();
  return row!.id;
}
async function addOrder(buyerId: string, sellerId: string, productIds: string[], status: "pending" | "completed" | "cancelled" | "expired" = "completed") {
  const [order] = await pg.insert(schema.orders).values({ buyersId: buyerId, sellersId: sellerId, status, totalAmount: "100" }).returning();
  await pg.insert(schema.ordered_items).values(productIds.map((productId, i) => ({
    ordersId: order!.id, productId, productName: `Item ${i + 1}`, unitPrice: "10", subtotal: "10",
  })));
  return order!.id;
}
const rate = (buyer: string, order: string, productRating: number, serviceRating: number, review?: string) =>
  createBuyerReview(buyer, order, { productRating, serviceRating, review });
async function failure(promise: Promise<unknown>) {
  try { await promise; } catch (error) { return error as InstanceType<typeof OrderError>; }
  throw new Error("expected an error");
}
const png = () => new File([Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), Buffer.alloc(32)])], "a.png", { type: "image/png" });

beforeAll(async () => {
  const result = await pushSchema(schema as never, pg as never);
  await result.apply();
});
beforeEach(async () => {
  uploads.length = 0;
  await pg.execute(sql`truncate table "user" cascade`);
});

describe("review eligibility (one review per completed order)", () => {
  test("a completed order can be reviewed with product stars, service stars and a comment", async () => {
    const [buyer, seller] = [await addUser("Nena Cruz"), await addUser("Seller")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    const review = await rate(buyer, order, 4, 5, "  Fresh and on time  ");
    expect(review).toMatchObject({ productRating: 4, serviceRating: 5, rating: 5, review: "Fresh and on time", photoUrl: null, sellerResponse: null });
    const [row] = await pg.select().from(schema.order_reviews);
    expect(row).toMatchObject({ orderId: order, buyerId: buyer, sellerId: seller, rating: 5, productRating: 4 });
  });

  for (const status of ["pending", "cancelled", "expired"] as const) {
    test(`a ${status} order cannot be reviewed`, async () => {
      const [buyer, seller] = [await addUser("B"), await addUser("S")];
      const order = await addOrder(buyer, seller, [await addProduct(seller, "Okra")], status);
      const error = await failure(rate(buyer, order, 5, 5));
      expect([error.statusCode, error.message]).toEqual([409, "Only completed orders can be reviewed"]);
      expect(await pg.select().from(schema.order_reviews)).toHaveLength(0);
    });
  }

  test("a second review for the same order is refused and the first one is kept", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    await rate(buyer, order, 5, 5);
    const error = await failure(rate(buyer, order, 1, 1));
    expect([error.statusCode, error.message]).toEqual([409, "Order already reviewed"]);
    const rows = await pg.select().from(schema.order_reviews);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ rating: 5, productRating: 5 });
  });

  test("two submits at the same moment save exactly one review", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    const results = await Promise.allSettled([rate(buyer, order, 5, 5), rate(buyer, order, 5, 5)]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(await pg.select().from(schema.order_reviews)).toHaveLength(1);
  });

  test("another buyer cannot review the order", async () => {
    const [buyer, other, seller] = [await addUser("B"), await addUser("O"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    const error = await failure(rate(other, order, 5, 5));
    expect(error.statusCode).toBe(404);
    expect(await pg.select().from(schema.order_reviews)).toHaveLength(0);
  });

  test("an unknown order is a 404", async () => {
    const buyer = await addUser("B");
    expect((await failure(rate(buyer, id(), 5, 5))).statusCode).toBe(404);
  });
});

describe("rating submission", () => {
  test("empty and spaces-only comments are stored as no comment", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const product = await addProduct(seller, "Tomato");
    const first = await rate(buyer, await addOrder(buyer, seller, [product]), 3, 3, "");
    const second = await rate(buyer, await addOrder(buyer, seller, [product]), 3, 3, "   \n ");
    const third = await rate(buyer, await addOrder(buyer, seller, [product]), 3, 3);
    expect([first.review, second.review, third.review]).toEqual([null, null, null]);
  });

  test("both star rows and the comment limit are enforced by the request schema", async () => {
    const app = new Elysia().post("/r", () => "ok", { body: buyerReviewBody }).patch("/r", () => "ok", { body: buyerReviewEditBody });
    const send = async (method: string, body: unknown) =>
      (await app.handle(new Request("http://localhost/r", { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) }))).status;
    expect(await send("POST", { productRating: 1, serviceRating: 5 })).toBe(200);
    expect(await send("POST", { productRating: 5, serviceRating: 1, review: "x".repeat(2000) })).toBe(200);
    expect(await send("POST", { productRating: 5, serviceRating: 5, review: "x".repeat(2001) })).toBe(422);
    // Elysia turns a whole-number string such as "5" into 5 before checking, so that one is accepted.
    expect(await send("POST", { productRating: "5", serviceRating: "4" })).toBe(200);
    for (const bad of [0, 6, -1, 3.5, "5.5", "abc", null, true]) {
      expect(await send("POST", { productRating: bad, serviceRating: 5 })).toBe(422);
      expect(await send("POST", { productRating: 5, serviceRating: bad })).toBe(422);
    }
    expect(await send("POST", { serviceRating: 5 })).toBe(422);
    expect(await send("POST", { productRating: 5 })).toBe(422);
    expect(await send("POST", {})).toBe(422);
    expect(await send("PATCH", { serviceRating: 6 })).toBe(422);
    expect(await send("PATCH", { productRating: 2 })).toBe(200);
  });

  test("the review can be read back by the buyer and the seller, and not by anyone else", async () => {
    const [buyer, seller, other] = [await addUser("B"), await addUser("S"), await addUser("O")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    await rate(buyer, order, 2, 4, "ok");
    expect(await readOrderReview(buyer, order, "buyer")).toMatchObject({ productRating: 2, serviceRating: 4, review: "ok" });
    expect(await readOrderReview(seller, order, "seller")).toMatchObject({ productRating: 2, serviceRating: 4 });
    expect((await failure(readOrderReview(other, order, "buyer"))).statusCode).toBe(404);
  });
});

describe("photo", () => {
  test("a real image is stored and shown through a signed link", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    await rate(buyer, order, 5, 5);
    const review = await setBuyerReviewPhoto(buyer, order, png());
    expect(uploads).toHaveLength(1);
    expect(uploads[0]).toMatch(new RegExp(`^private-reviews/${order}/[0-9a-f-]{36}\\.png$`));
    expect(review.photoUrl).toBe(`https://signed.example/${uploads[0]}`);
    expect((await readOrderReview(seller, order, "seller")).photoUrl).toBe(review.photoUrl);
  });

  test("the photo is optional", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    const review = await rate(buyer, order, 5, 5);
    expect(review.photoUrl).toBeNull();
    expect(uploads).toHaveLength(0);
  });

  test("wrong type, fake image content and files over 5 MB are refused", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    await rate(buyer, order, 5, 5);
    const bad = [
      new File(["hello"], "a.txt", { type: "text/plain" }),
      new File([Buffer.alloc(40)], "fake.png", { type: "image/png" }),
      new File([Buffer.alloc(5 * 1024 * 1024 + 1)], "big.png", { type: "image/png" }),
      new File([Buffer.alloc(40)], "a.pdf", { type: "application/pdf" }),
    ];
    for (const file of bad) expect((await failure(setBuyerReviewPhoto(buyer, order, file))).statusCode).toBe(400);
    expect(uploads).toHaveLength(0);
    const [row] = await pg.select().from(schema.order_reviews);
    expect(row!.photoKey).toBeNull();
  });

  test("only the author can add a photo, and only once a review exists", async () => {
    const [buyer, seller, other] = [await addUser("B"), await addUser("S"), await addUser("O")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    expect((await failure(setBuyerReviewPhoto(buyer, order, png()))).statusCode).toBe(404);
    await rate(buyer, order, 5, 5);
    expect((await failure(setBuyerReviewPhoto(other, order, png()))).statusCode).toBe(404);
  });

  test("a photo cannot be added after the edit window", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    await rate(buyer, order, 5, 5);
    await pg.update(schema.order_reviews).set({ createdAt: new Date(Date.now() - (reviewEditDays + 1) * day) });
    expect((await failure(setBuyerReviewPhoto(buyer, order, png()))).statusCode).toBe(403);
  });
});

describe("editing for 15 days", () => {
  test("the window is exactly 15 days", () => {
    const created = new Date("2026-11-01T00:00:00Z");
    expect(reviewEditDays).toBe(15);
    expect(reviewEditDeadline(created).toISOString()).toBe("2026-11-16T00:00:00.000Z");
    expect(isReviewEditable(created, new Date("2026-11-15T23:59:59Z"))).toBe(true);
    expect(isReviewEditable(created, new Date("2026-11-16T00:00:00Z"))).toBe(true);
    expect(isReviewEditable(created, new Date("2026-11-16T00:00:01Z"))).toBe(false);
  });

  test("an edit changes the same review and never creates a second one", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    const created = await rate(buyer, order, 5, 5, "great");
    const edited = await editBuyerReview(buyer, order, { productRating: 2, serviceRating: 4, review: "second look" });
    expect(edited).toMatchObject({ id: created.id, productRating: 2, serviceRating: 4, review: "second look" });
    expect(edited.updatedAt).not.toBeNull();
    expect(await pg.select().from(schema.order_reviews)).toHaveLength(1);
  });

  test("one thing can be changed without touching the rest; empty text clears the comment", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    await rate(buyer, order, 3, 4, "keep me");
    expect(await editBuyerReview(buyer, order, { serviceRating: 1 })).toMatchObject({ productRating: 3, serviceRating: 1, review: "keep me" });
    expect(await editBuyerReview(buyer, order, { review: "  " })).toMatchObject({ productRating: 3, serviceRating: 1, review: null });
  });

  test("an edit with nothing to change is refused", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    await rate(buyer, order, 3, 4);
    expect((await failure(editBuyerReview(buyer, order, {}))).statusCode).toBe(400);
  });

  test("an edit after 15 days is refused and nothing changes", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    await rate(buyer, order, 5, 5);
    const [row] = await pg.select().from(schema.order_reviews);
    const error = await failure(editBuyerReview(buyer, order, { serviceRating: 1 }, new Date(row!.createdAt.getTime() + 15 * day + 1000)));
    expect([error.statusCode, error.message]).toEqual([403, "Reviews can only be changed for 15 days"]);
    expect((await pg.select().from(schema.order_reviews))[0]).toMatchObject({ rating: 5, updatedAt: null });
  });

  test("an edit on day 14 still works", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    await rate(buyer, order, 5, 5);
    const [row] = await pg.select().from(schema.order_reviews);
    const edited = await editBuyerReview(buyer, order, { serviceRating: 3 }, new Date(row!.createdAt.getTime() + 14 * day));
    expect(edited.serviceRating).toBe(3);
  });

  test("only the author can edit; no review is a 404", async () => {
    const [buyer, seller, other] = [await addUser("B"), await addUser("S"), await addUser("O")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    expect((await failure(editBuyerReview(buyer, order, { serviceRating: 1 }))).statusCode).toBe(404);
    await rate(buyer, order, 5, 5);
    expect((await failure(editBuyerReview(other, order, { serviceRating: 1 }))).statusCode).toBe(404);
  });

  test("the seller's reply and the photo survive an edit", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const order = await addOrder(buyer, seller, [await addProduct(seller, "Tomato")]);
    await rate(buyer, order, 5, 5);
    await setBuyerReviewPhoto(buyer, order, png());
    await pg.update(schema.order_reviews).set({ sellerResponse: "Thank you!" }).where(eq(schema.order_reviews.orderId, order));
    const edited = await editBuyerReview(buyer, order, { productRating: 4 });
    expect(edited).toMatchObject({ sellerResponse: "Thank you!", productRating: 4 });
    expect(edited.photoUrl).toBe(`https://signed.example/${uploads[0]}`);
  });

  test("averages and trust follow the edit", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const product = await addProduct(seller, "Tomato");
    const order = await addOrder(buyer, seller, [product]);
    await rate(buyer, order, 5, 1, "Late and rude");
    expect((await readSellerRating(seller)).average).toBe("1.00");
    expect((await readTrustMonitoringScore(seller)).ratingSignals).toBe(1);
    await editBuyerReview(buyer, order, { serviceRating: 5, productRating: 3 });
    expect((await readSellerRating(seller)).average).toBe("5.00");
    expect((await readTrustMonitoringScore(seller)).ratingSignals).toBe(0);
    expect((await readProductRatings([product])).get(product)).toEqual({ average: "3.0", count: 1 });
  });
});

describe("product stars and service stars stay apart", () => {
  test("a bad product never lowers the seller's trust rating or trust points", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const product = await addProduct(seller, "Tomato");
    await rate(buyer, await addOrder(buyer, seller, [product]), 1, 5);
    expect(await readSellerRating(seller)).toEqual({ sellerId: seller, count: 1, average: "5.00" });
    const trust = await readTrustMonitoringScore(seller);
    expect([trust.ratingSignals, trust.weightedPoints]).toEqual([0, 0]);
    expect((await readProductRatings([product])).get(product)).toEqual({ average: "1.0", count: 1 });
  });

  test("a bad service never lowers the product rating but does count for trust", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const product = await addProduct(seller, "Tomato");
    await rate(buyer, await addOrder(buyer, seller, [product]), 5, 2, "The produce was not fresh");
    expect((await readProductRatings([product])).get(product)).toEqual({ average: "5.0", count: 1 });
    const trust = await readTrustMonitoringScore(seller);
    expect([trust.ratingSignals, trust.weightedPoints]).toEqual([1, trustPolicyWeights.low_rating]);
  });

  test("service stars of 3 or more add no trust points; a low rating counts with a reason or as the 2nd low in 30 days", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const product = await addProduct(seller, "Tomato");
    for (const stars of [1, 2, 3, 4, 5]) await rate(buyer, await addOrder(buyer, seller, [product]), 5, stars);
    // 1 star without a reason does not count; the 2nd low rating inside 30 days does.
    expect((await readTrustMonitoringScore(seller)).ratingSignals).toBe(1);
    await rate(buyer, await addOrder(buyer, seller, [product]), 5, 1, "Rotten");
    expect((await readTrustMonitoringScore(seller)).ratingSignals).toBe(2);
  });

  test("the trust rating is the average of service stars across orders (rounded to 2 places)", async () => {
    const [buyer, seller, other] = [await addUser("B"), await addUser("S"), await addUser("O")];
    const product = await addProduct(seller, "Tomato");
    for (const stars of [5, 4, 4]) await rate(buyer, await addOrder(buyer, seller, [product]), 1, stars);
    expect(await readSellerRating(seller)).toEqual({ sellerId: seller, count: 3, average: "4.33" });
    expect(await readSellerRating(other)).toEqual({ sellerId: other, count: 0, average: null });
  });

  test("an old review without product stars still counts for the seller and not for products", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const product = await addProduct(seller, "Tomato");
    const order = await addOrder(buyer, seller, [product]);
    await pg.insert(schema.order_reviews).values({ orderId: order, buyerId: buyer, sellerId: seller, rating: 4 });
    expect((await readSellerRating(seller)).average).toBe("4.00");
    expect((await readProductRatings([product])).has(product)).toBe(false);
  });

  test("a seller with a bad service and another seller's reviews do not mix", async () => {
    const [buyer, s1, s2] = [await addUser("B"), await addUser("S1"), await addUser("S2")];
    await rate(buyer, await addOrder(buyer, s1, [await addProduct(s1, "A")]), 5, 1);
    expect((await readTrustMonitoringScore(s2)).ratingSignals).toBe(0);
    expect((await readSellerRating(s2)).count).toBe(0);
  });
});

describe("one product rating for a whole multi-item order", () => {
  test("every product in the order gets that product rating, once", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const [a, b, c] = [await addProduct(seller, "A"), await addProduct(seller, "B"), await addProduct(seller, "C")];
    const order = await addOrder(buyer, seller, [a, b, c]);
    await rate(buyer, order, 4, 5);
    expect(await pg.select().from(schema.order_reviews)).toHaveLength(1);
    const ratings = await readProductRatings([a, b, c]);
    for (const product of [a, b, c]) expect(ratings.get(product)).toEqual({ average: "4.0", count: 1 });
  });

  test("the same product bought twice in one order counts once", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const a = await addProduct(seller, "A");
    await rate(buyer, await addOrder(buyer, seller, [a, a]), 2, 5);
    expect((await readProductRatings([a])).get(a)).toEqual({ average: "2.0", count: 1 });
  });

  test("product averages combine reviews from different orders and round to one place", async () => {
    const [buyer, seller] = [await addUser("B"), await addUser("S")];
    const [a, b] = [await addProduct(seller, "A"), await addProduct(seller, "B")];
    await rate(buyer, await addOrder(buyer, seller, [a, b]), 5, 5);
    await rate(buyer, await addOrder(buyer, seller, [a]), 4, 5);
    await rate(buyer, await addOrder(buyer, seller, [a]), 4, 5);
    expect((await readProductRatings([a, b])).get(a)).toEqual({ average: "4.3", count: 3 });
    expect((await readProductRatings([a, b])).get(b)).toEqual({ average: "5.0", count: 1 });
    expect((await readProductRatings([])).size).toBe(0);
  });
});

describe("product reviews list", () => {
  test("no reviews: zero count, no average", async () => {
    const seller = await addUser("S");
    const product = await addProduct(seller, "A");
    expect(await listMarketplaceProductReviews(product)).toMatchObject({ count: 0, average: null, reviews: [], breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  });

  test("unknown product is a 404", async () => {
    expect((await failure(listMarketplaceProductReviews(id()))).statusCode).toBe(404);
  });

  test("shows product stars, the shared comment, photo, masked name and reply; newest first; max 10", async () => {
    const [seller, buyer] = [await addUser("S"), await addUser("Nena Cruz")];
    const product = await addProduct(seller, "A");
    const other = await addProduct(seller, "Other");
    const first = await addOrder(buyer, seller, [product]);
    await rate(buyer, first, 5, 1, "first");
    await setBuyerReviewPhoto(buyer, first, png());
    await pg.update(schema.order_reviews).set({ sellerResponse: "Thanks" }).where(eq(schema.order_reviews.orderId, first));
    await rate(buyer, await addOrder(buyer, seller, [other]), 1, 1, "not this product");
    for (let i = 0; i < 11; i++) await rate(buyer, await addOrder(buyer, seller, [product]), 4, 5, `r${i}`);
    const result = await listMarketplaceProductReviews(product);
    expect(result.count).toBe(12);
    expect(result.reviews).toHaveLength(10);
    expect(result.breakdown).toEqual({ 5: 1, 4: 11, 3: 0, 2: 0, 1: 0 });
    expect(result.average).toBe("4.1");
    expect(result.reviews.every((r) => r.rating === 4 && r.buyerName === "Nena C.")).toBe(true);
    expect(result.reviews[0]!.review).toBe("r10");
    await pg.update(schema.order_reviews).set({ createdAt: new Date(0) }).where(eq(schema.order_reviews.orderId, first));
    const withFirst = await listMarketplaceProductReviews(product);
    expect(withFirst.count).toBe(12);
  });

  test("a review with photo and reply is returned with both", async () => {
    const [seller, buyer] = [await addUser("S"), await addUser("Maria")];
    const product = await addProduct(seller, "A");
    const order = await addOrder(buyer, seller, [product]);
    await rate(buyer, order, 5, 5, "great");
    await setBuyerReviewPhoto(buyer, order, png());
    await pg.update(schema.order_reviews).set({ sellerResponse: "Thanks" }).where(eq(schema.order_reviews.orderId, order));
    const [review] = (await listMarketplaceProductReviews(product)).reviews;
    expect(review).toMatchObject({ rating: 5, review: "great", sellerResponse: "Thanks", buyerName: "Maria", photoUrl: `https://signed.example/${uploads[0]}` });
  });
});
