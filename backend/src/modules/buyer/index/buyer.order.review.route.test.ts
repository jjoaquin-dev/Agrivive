import { beforeAll, beforeEach, describe, expect, mock, test } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { pushSchema } from "drizzle-kit/api-postgres";
import { sql } from "drizzle-orm";
import { Elysia } from "elysia";
import * as schema from "../../../db/schema";

// Real routes and the real sign-in guard, with an in-memory Postgres, a fake session lookup and a fake S3.
process.env.TRUST_ACTIONS_ENABLED = "false";
const pg = drizzle({ client: new PGlite() });
const here = import.meta.dir;
mock.module(`${here}/../../../db/index.ts`, () => ({ db: pg }));
mock.module(`${here}/../../auth/index.ts`, () => ({
  auth: { api: { getSession: async ({ headers }: { headers: Headers }) => {
    const id = headers.get("x-user");
    return id ? { user: { id }, session: { userId: id } } : null;
  } } },
}));
mock.module(`${here}/../../../utils/seller-access/index.ts`, () => ({ requireVerifiedSeller: async () => {} }));
const uploads: string[] = [];
mock.module(`${here}/../../../utils/s3/private-upload.ts`, () => ({
  uploadPrivateObject: async (p: { key: string }) => { uploads.push(p.key); return p.key; },
}));
mock.module(`${here}/../../../utils/s3/private-download.ts`, () => ({
  createPrivateDownloadUrl: async (key: string) => `https://signed.example/${key}`,
}));

const { buyerReviewRoute } = await import("./buyer.order.review");
const { sellerReviewRoute } = await import("../../seller/index/seller.order.review");
const { userStatusCache } = await import("../../../utils/user-status-cache");
const app = new Elysia().group("/buyer", (a) => a.use(buyerReviewRoute)).group("/seller", (a) => a.use(sellerReviewRoute));

const day = 86_400_000;
// A real 1x1 PNG: the route also checks the file content, so a made-up header is not enough.
const png = () => new File([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64")], "a.png", { type: "image/png" });

async function call(method: string, path: string, user?: string, body?: unknown) {
  const headers: Record<string, string> = user ? { "x-user": user } : {};
  let payload: BodyInit | undefined;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) { headers["content-type"] = "application/json"; payload = JSON.stringify(body); }
  const response = await app.handle(new Request(`http://localhost${path}`, { method, headers, body: payload }));
  const text = await response.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  return { status: response.status, json };
}

async function seed(status: "pending" | "completed" | "cancelled" | "expired" = "completed", products = 1) {
  await pg.insert(schema.user).values([
    { id: "buyer", name: "Nena Cruz", email: "b@t.dev", role: ["buyer"] },
    { id: "buyer2", name: "Other", email: "b2@t.dev", role: ["buyer"] },
    { id: "seller", name: "Seller", email: "s@t.dev", role: ["seller"] },
  ]).onConflictDoNothing();
  const ids: string[] = [];
  for (let i = 0; i < products; i++) {
    const [p] = await pg.insert(schema.sellers_product).values({ userId: "seller", productName: `P${i}`, productType: "Leafy Greens", scalingType: "kilo" }).returning();
    ids.push(p!.id);
  }
  const [order] = await pg.insert(schema.orders).values({ buyersId: "buyer", sellersId: "seller", status, totalAmount: "50" }).returning();
  await pg.insert(schema.ordered_items).values(ids.map((productId) => ({ ordersId: order!.id, productId, productName: "x", unitPrice: "5", subtotal: "5" })));
  return order!.id;
}

beforeAll(async () => { await (await pushSchema(schema as never, pg as never)).apply(); });
beforeEach(async () => {
  uploads.length = 0;
  userStatusCache.clear();
  await pg.execute(sql`truncate table "user" cascade`);
});

describe("POST /buyer/orders/:id/review", () => {
  test("401 without a session, 403 for a seller account", async () => {
    const order = await seed();
    const body = { productRating: 5, serviceRating: 5 };
    expect((await call("POST", `/buyer/orders/${order}/review`, undefined, body)).status).toBe(401);
    expect((await call("POST", `/buyer/orders/${order}/review`, "seller", body)).status).toBe(403);
  });

  test("201 with the one-screen review for a completed order", async () => {
    const order = await seed();
    const res = await call("POST", `/buyer/orders/${order}/review`, "buyer", { productRating: 3, serviceRating: 5, review: "Good" });
    expect(res.status).toBe(201);
    expect(res.json).toMatchObject({ orderId: order, productRating: 3, serviceRating: 5, rating: 5, review: "Good", photoUrl: null, sellerResponse: null, updatedAt: null });
    const created = new Date(res.json.createdAt).getTime();
    expect(new Date(res.json.editableUntil).getTime() - created).toBe(15 * day);
  });

  test("422 for bad stars, a missing star row, a long comment and a bad order id", async () => {
    const order = await seed();
    const url = `/buyer/orders/${order}/review`;
    for (const body of [
      { productRating: 0, serviceRating: 5 }, { productRating: 5, serviceRating: 6 }, { productRating: 2.5, serviceRating: 5 },
      { serviceRating: 5 }, { productRating: 5 }, {}, { productRating: 5, serviceRating: 5, review: "x".repeat(2001) },
    ]) expect((await call("POST", url, "buyer", body)).status).toBe(422);
    expect((await call("POST", "/buyer/orders/not-a-uuid/review", "buyer", { productRating: 5, serviceRating: 5 })).status).toBe(422);
    expect((await call("GET", url, "buyer")).status).toBe(404);
  });

  for (const status of ["pending", "cancelled", "expired"] as const) {
    test(`409 for a ${status} order`, async () => {
      const order = await seed(status);
      const res = await call("POST", `/buyer/orders/${order}/review`, "buyer", { productRating: 5, serviceRating: 5 });
      expect([res.status, res.json.message]).toEqual([409, "Only completed orders can be reviewed"]);
    });
  }

  test("409 on a second review, 404 for another buyer", async () => {
    const order = await seed();
    const body = { productRating: 5, serviceRating: 5 };
    expect((await call("POST", `/buyer/orders/${order}/review`, "buyer2", body)).status).toBe(404);
    expect((await call("POST", `/buyer/orders/${order}/review`, "buyer", body)).status).toBe(201);
    const again = await call("POST", `/buyer/orders/${order}/review`, "buyer", body);
    expect([again.status, again.json.message]).toEqual([409, "Order already reviewed"]);
  });
});

describe("PATCH /buyer/orders/:id/review and the photo", () => {
  test("edit inside the window, photo upload, then both are read back by buyer and seller", async () => {
    const order = await seed("completed", 3);
    await call("POST", `/buyer/orders/${order}/review`, "buyer", { productRating: 5, serviceRating: 5, review: "first" });
    const edit = await call("PATCH", `/buyer/orders/${order}/review`, "buyer", { productRating: 2, serviceRating: 4 });
    expect([edit.status, edit.json.productRating, edit.json.serviceRating, edit.json.review]).toEqual([200, 2, 4, "first"]);
    expect(edit.json.updatedAt).not.toBeNull();

    const form = new FormData();
    form.append("file", png());
    const photo = await call("POST", `/buyer/orders/${order}/review/photo`, "buyer", form);
    expect(photo.status).toBe(200);
    expect(photo.json.photoUrl).toBe(`https://signed.example/${uploads[0]}`);

    const buyerView = await call("GET", `/buyer/orders/${order}/review`, "buyer");
    const sellerView = await call("GET", `/seller/orders/${order}/review`, "seller");
    for (const view of [buyerView, sellerView]) {
      expect(view.status).toBe(200);
      expect(view.json).toMatchObject({ productRating: 2, serviceRating: 4, review: "first", photoUrl: photo.json.photoUrl });
    }
    expect((await call("GET", `/seller/orders/${order}/review`, "buyer")).status).toBe(403);
    expect(await pg.select().from(schema.order_reviews)).toHaveLength(1);
  });

  test("400 when nothing is sent, 422 for a bad star, 404 with no review", async () => {
    const order = await seed();
    expect((await call("PATCH", `/buyer/orders/${order}/review`, "buyer", { serviceRating: 4 })).status).toBe(404);
    await call("POST", `/buyer/orders/${order}/review`, "buyer", { productRating: 5, serviceRating: 5 });
    expect((await call("PATCH", `/buyer/orders/${order}/review`, "buyer", {})).status).toBe(400);
    expect((await call("PATCH", `/buyer/orders/${order}/review`, "buyer", { serviceRating: 9 })).status).toBe(422);
    expect((await call("PATCH", `/buyer/orders/${order}/review`, "buyer2", { serviceRating: 1 })).status).toBe(404);
  });

  test("403 for an edit or a photo after 15 days", async () => {
    const order = await seed();
    await call("POST", `/buyer/orders/${order}/review`, "buyer", { productRating: 5, serviceRating: 5 });
    await pg.update(schema.order_reviews).set({ createdAt: new Date(Date.now() - 16 * day) });
    const edit = await call("PATCH", `/buyer/orders/${order}/review`, "buyer", { serviceRating: 1 });
    expect([edit.status, edit.json.message]).toEqual([403, "Reviews can only be changed for 15 days"]);
    const form = new FormData();
    form.append("file", png());
    expect((await call("POST", `/buyer/orders/${order}/review/photo`, "buyer", form)).status).toBe(403);
    expect((await pg.select().from(schema.order_reviews))[0]!.rating).toBe(5);
  });

  test("a text file, a fake image and a missing file are refused", async () => {
    const order = await seed();
    await call("POST", `/buyer/orders/${order}/review`, "buyer", { productRating: 5, serviceRating: 5 });
    const url = `/buyer/orders/${order}/review/photo`;
    const text = new FormData(); text.append("file", new File(["hi"], "a.txt", { type: "text/plain" }));
    const fake = new FormData(); fake.append("file", new File([Buffer.alloc(30)], "a.png", { type: "image/png" }));
    expect((await call("POST", url, "buyer", text)).status).toBe(422);
    expect((await call("POST", url, "buyer", fake)).status).toBe(422); // the route checks the real file content before the service does
    expect((await call("POST", url, "buyer", new FormData())).status).toBe(422);
    expect(uploads).toHaveLength(0);
  });
});

describe("what sellers and the public see", () => {
  test("seller list carries service stars, product stars and photo; reply works once; the star filter uses service stars", async () => {
    const order = await seed();
    await call("POST", `/buyer/orders/${order}/review`, "buyer", { productRating: 1, serviceRating: 5, review: "slow stall but fine" });
    const form = new FormData(); form.append("file", png());
    await call("POST", `/buyer/orders/${order}/review/photo`, "buyer", form);
    const list = await call("GET", "/seller/reviews", "seller");
    expect(list.status).toBe(200);
    expect(list.json.summary).toMatchObject({ count: 1, average: "5.0", unansweredCount: 1 });
    expect(list.json.reviews[0]).toMatchObject({ serviceRating: 5, rating: 5, productRating: 1, review: "slow stall but fine", buyerName: "Nena C.", photoUrl: expect.stringContaining("signed.example") });
    expect((await call("GET", "/seller/reviews?rating=5", "seller")).json.reviews).toHaveLength(1);
    expect((await call("GET", "/seller/reviews?rating=1", "seller")).json.reviews).toHaveLength(0);
    const id = list.json.reviews[0].id;
    expect((await call("POST", `/seller/reviews/${id}/reply`, "seller", { response: "Thanks!" })).status).toBe(200);
    expect((await call("POST", `/seller/reviews/${id}/reply`, "seller", { response: "Again" })).status).toBe(404);
    expect((await call("GET", `/buyer/orders/${order}/review`, "buyer")).json.sellerResponse).toBe("Thanks!");
  });

  test("the public seller rating is the average of service stars only", async () => {
    const first = await seed();
    await call("POST", `/buyer/orders/${first}/review`, "buyer", { productRating: 1, serviceRating: 5 });
    const [second] = await pg.insert(schema.orders).values({ buyersId: "buyer", sellersId: "seller", status: "completed", totalAmount: "5" }).returning();
    await call("POST", `/buyer/orders/${second!.id}/review`, "buyer", { productRating: 1, serviceRating: 4 });
    const rating = await call("GET", "/buyer/sellers/seller/rating");
    expect(rating.json).toEqual({ sellerId: "seller", count: 2, average: "4.50" });
    const reviews = await call("GET", "/buyer/sellers/seller/reviews");
    expect(reviews.json).toMatchObject({ count: 2, average: "4.5", breakdown: { 5: 1, 4: 1, 3: 0, 2: 0, 1: 0 } });
  });
});
