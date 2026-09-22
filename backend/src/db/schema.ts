import { relations } from "drizzle-orm/_relations";
import { sql } from "drizzle-orm";
import { decimal, integer, smallint } from "drizzle-orm/pg-core";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
  pgEnum,
  uuid,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["seller", "buyer", "admin"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: roleEnum().array().default(["buyer"]),
  isActive: boolean("is_active").default(true).notNull(),
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const twoFactor = pgTable("two_factor", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  verified: boolean("verified").default(true).notNull(),
  failedVerificationCount: integer("failed_verification_count").default(0).notNull(),
  lockedUntil: timestamp("locked_until"),
}, (table) => [index("two_factor_user_id_idx").on(table.userId)]);

export const sellers_profile = pgTable("sellers_profile", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  shopName: text("shop_name").notNull(),
  detailAddress: text("detail_address").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  phoneNumber: text("phone_number"),
  isCurrent: boolean("is_current").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [uniqueIndex("sellers_profile_current_user_unique").on(table.userId)
  .where(sql`${table.isCurrent} = true`)]);

export const product_type_enum = pgEnum("product_type", [
  "Leafy Greens",
  "Root and Tuber Vegetables",
  "Bulb and Stem Vegetables",
  "Flower Vegetables",
  "Fruit Vegetables",
  "Seeds and Legumes",
]);
export const scaling_type_enum = pgEnum("scaling_type", [
  "sack",
  "kilo",
  "pile",
]);
export const sellers_product = pgTable("sellers_product", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productName: text("product_name").notNull(),
  imagUrl: text("image_url"),
  productPrice: decimal("product_price", { precision: 10, scale: 2 }),
  productQty: decimal("product_qty", {
    precision: 10,
    scale: 2,
  }),
  originalQty: decimal("original_qty", { precision: 10, scale: 2 }),
  lowStockThreshold: decimal("low_stock_threshold", { precision: 10, scale: 2 }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  isMarketable: boolean("is_marketable").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  productType: product_type_enum().notNull(),
  scalingType: scaling_type_enum().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const listing_cycles = pgTable("listing_cycles", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "cascade" }),
  vegetableKey: text("vegetable_key").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  originalQty: decimal("original_qty", { precision: 10, scale: 2 }).notNull(),
});

export const product_stock_adjustments = pgTable("product_stock_adjustments", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "restrict" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "restrict" }),
  delta: decimal("delta", { precision: 11, scale: 2 }).notNull(),
  beforeQty: decimal("before_qty", { precision: 10, scale: 2 }).notNull(),
  afterQty: decimal("after_qty", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("product_stock_adjustments_product_created_idx").on(table.productId, table.createdAt)]);

export const order_status = pgEnum("order_status", [
  "pending",
  "completed",
  "cancelled",
  "expired",
]);

export const checkouts = pgTable(
  "checkouts",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    buyersId: text("buyers_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    idempotencyKey: text("idempotency_key").notNull(),
    requestFingerprint: text("request_fingerprint").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("checkouts_buyer_key_unique").on(
      table.buyersId,
      table.idempotencyKey,
    ),
  ],
);

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  checkoutId: uuid("checkout_id").references(() => checkouts.id, {
    onDelete: "restrict",
  }),
  buyersId: text("buyers_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  sellersId: text("sellers_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: order_status().notNull().default("pending"),
  cancelledBy: text("cancelled_by"),
  cancellationReason: text("cancellation_reason"),
  totalAmount: decimal("total_amount").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const seller_scan_grace = pgTable("seller_scan_grace", {
  orderId: uuid("order_id").primaryKey().references(() => orders.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  graceUntil: timestamp("grace_until", { withTimezone: true }).notNull(),
});

export const order_inquiries = pgTable("order_inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  reply: text("reply"),
  repliedAt: timestamp("replied_at", { withTimezone: true }),
  deadlineStage: smallint("deadline_stage").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("order_inquiries_one_open_per_order").on(table.orderId)
  .where(sql`${table.repliedAt} is null`)]);

export const order_reviews = pgTable("order_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().unique().references(() => orders.id, { onDelete: "cascade" }),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  rating: smallint("rating").notNull(),
  review: text("review"),
  sellerResponse: text("seller_response"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const order_reports = pgTable("order_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  reporterId: text("reporter_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  details: text("details").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex("order_reports_order_reporter_unique").on(table.orderId, table.reporterId)]);

export const trust_events = pgTable("trust_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventKey: text("event_key").notNull().unique(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  classification: text("classification").notNull(),
  sourceId: uuid("source_id"),
  policyVersion: text("policy_version").notNull().default("v1-warning-only"),
  invalidatedAt: timestamp("invalidated_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const trust_notices = pgTable("trust_notices", {
  id: uuid("id").defaultRandom().primaryKey(),
  noticeKey: text("notice_key").notNull().unique(),
  recipientId: text("recipient_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const trust_corrections = pgTable("trust_corrections", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id").notNull().unique().references(() => trust_events.id, { onDelete: "cascade" }),
  requesterId: text("requester_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  outcome: text("outcome").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const ordered_items = pgTable("ordered_items", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  ordersId: uuid("orders_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => sellers_product.id, { onDelete: "restrict" }),
  productName: text("product_name"),
  scalingType: scaling_type_enum("scaling_type"),
  quantity: decimal("quantity", {
    precision: 10,
    scale: 2,
  }),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", {
    precision: 20,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
