import { relations } from "drizzle-orm/_relations";
import { sql } from "drizzle-orm";
import { decimal, integer, jsonb, smallint } from "drizzle-orm/pg-core";
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

export const roleEnum = pgEnum("role", ["seller", "buyer", "admin", "stakeholder"]);

export const notification_device_platform_enum = pgEnum("notification_device_platform", [
  "android",
  "ios",
  "web",
]);
export const notification_outbox_status_enum = pgEnum("notification_outbox_status", [
  "pending",
  "processing",
  "sent",
  "failed",
]);
export const notification_type_enum = pgEnum("notification_type", [
  "seller_message",
  "buyer_message",
  "seller_listing",
  "seller_boost",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: roleEnum().array().default(["buyer"]),
  isActive: boolean("is_active").default(true).notNull(),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
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

export const seller_type_enum = pgEnum("seller_type", [
  "supplier",
  "supplier_vendor",
  "retail_vendor",
]);

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
  sellerType: seller_type_enum("seller_type").default("supplier").notNull(),
  pickupInstructions: text("pickup_instructions"),
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
  "Root Vegetables",
  "Bulb Vegetables",
  "Stem Vegetables",
  "Pod Vegetables",
  "Tuber Vegetables",
  "Seed Vegetables",
]);
export const vegetable_category_enum = pgEnum("vegetable_category", [
  "Leafy Greens",
  "Root Vegetables",
  "Bulb Vegetables",
  "Stem Vegetables",
  "Flower Vegetables",
  "Fruit Vegetables",
  "Pod Vegetables",
  "Tuber Vegetables",
  "Seed Vegetables",
]);
export const vegetable_review_status_enum = pgEnum("vegetable_review_status", [
  "draft",
  "approved",
  "inactive",
]);
export const product_condition_enum = pgEnum("product_condition", [
  "good",
  "fair",
  "needs_inspection",
]);
export const scaling_type_enum = pgEnum("scaling_type", [
  "sack",
  "kilo",
  "pile",
]);
export const vegetable_catalog = pgTable("vegetable_catalog", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  filipinoName: text("filipino_name").notNull(),
  englishName: text("english_name").notNull(),
  searchAliases: jsonb("search_aliases").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  searchText: text("search_text").notNull(),
  category: vegetable_category_enum().notNull(),
  scientificName: text("scientific_name"),
  sourceUrl: text("source_url").notNull(),
  reviewStatus: vegetable_review_status_enum("review_status").default("approved").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [
  uniqueIndex("vegetable_catalog_filipino_name_unique").on(table.filipinoName),
  index("vegetable_catalog_search_text_idx").on(table.searchText),
  index("vegetable_catalog_category_idx").on(table.category),
]);
export const sellers_product = pgTable("sellers_product", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  vegetableCatalogId: uuid("vegetable_catalog_id")
    .references(() => vegetable_catalog.id, { onDelete: "restrict" }),
  productName: text("product_name").notNull(),
  imagUrl: text("image_url"),
  productPrice: decimal("product_price", { precision: 10, scale: 2 }),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }),
  priceReductionPercent: decimal("price_reduction_percent", { precision: 5, scale: 2 }).default("0").notNull(),
  minimumPrice: decimal("minimum_price", { precision: 10, scale: 2 }),
  priceScheduleStartedAt: timestamp("price_schedule_started_at", { withTimezone: true }),
  priceReductionPeriodsApplied: integer("price_reduction_periods_applied").default(0).notNull(),
  productQty: decimal("product_qty", {
    precision: 10,
    scale: 2,
  }),
  originalQty: decimal("original_qty", { precision: 10, scale: 2 }),
  lowStockThreshold: decimal("low_stock_threshold", { precision: 10, scale: 2 }),
  condition: product_condition_enum().default("needs_inspection").notNull(),
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
}, (table) => [
  index("sellers_product_marketplace_visibility_idx")
    .on(table.isActive, table.isMarketable, table.publishedAt),
  index("sellers_product_user_id_created_at_idx")
    .on(table.userId, table.createdAt),
]);

export const buyer_saved_products = pgTable("buyer_saved_products", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  buyerId: text("buyer_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => sellers_product.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("buyer_saved_products_buyer_product_unique").on(table.buyerId, table.productId),
  index("buyer_saved_products_buyer_created_idx").on(table.buyerId, table.createdAt),
]);

export const seller_follows = pgTable("seller_follows", {
  id: uuid("id").defaultRandom().primaryKey(),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("seller_follows_buyer_seller_unique").on(table.buyerId, table.sellerId),
  index("seller_follows_seller_created_idx").on(table.sellerId, table.createdAt),
]);

export const seller_listing_events = pgTable("seller_listing_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  shopName: text("shop_name").notNull(),
  productName: text("product_name").notNull(),
  eventType: text("event_type").default("new_listing").notNull(),
  metadata: jsonb("metadata").$type<{
    oldPrice?: string;
    newPrice?: string;
    priceReductionPercent?: number;
    stock?: string;
  }>().default(sql`'{}'::jsonb`).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
}, (table) => [
  index("seller_listing_events_product_idx").on(table.productId, table.eventType),
  index("seller_listing_events_pending_idx").on(table.processedAt, table.createdAt),
]);

export const buyer_listing_notices = pgTable("buyer_listing_notices", {
  id: uuid("id").defaultRandom().primaryKey(),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  eventId: uuid("event_id").notNull().references(() => seller_listing_events.id, { onDelete: "cascade" }),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("buyer_listing_notices_buyer_event_unique").on(table.buyerId, table.eventId),
  index("buyer_listing_notices_buyer_created_idx").on(table.buyerId, table.createdAt),
]);

export const notification_devices = pgTable("notification_devices", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  platform: notification_device_platform_enum("platform").notNull(),
  pushToken: text("push_token").notNull(),
  deviceId: text("device_id"),
  isEnabled: boolean("is_enabled").default(true).notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
  invalidatedAt: timestamp("invalidated_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [
  uniqueIndex("notification_devices_push_token_unique").on(table.pushToken),
  index("notification_devices_user_enabled_idx").on(table.userId, table.isEnabled),
]);

export const notification_outbox = pgTable("notification_outbox", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipientUserId: text("recipient_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  type: notification_type_enum("type").notNull(),
  aggregationKey: text("aggregation_key").notNull(),
  dedupeKey: text("dedupe_key").notNull(),
  referenceId: text("reference_id"),
  itemCount: integer("item_count").default(1).notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  status: notification_outbox_status_enum("status").default("pending").notNull(),
  attemptCount: integer("attempt_count").default(0).notNull(),
  availableAt: timestamp("available_at", { withTimezone: true }).defaultNow().notNull(),
  lockedAt: timestamp("locked_at", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  failedAt: timestamp("failed_at", { withTimezone: true }),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [
  uniqueIndex("notification_outbox_dedupe_unique").on(table.dedupeKey),
  index("notification_outbox_pending_idx").on(table.status, table.availableAt, table.createdAt),
  index("notification_outbox_recipient_idx").on(table.recipientUserId, table.createdAt),
]);

export const listing_cycles = pgTable("listing_cycles", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "cascade" }),
  vegetableCatalogId: uuid("vegetable_catalog_id")
    .references(() => vegetable_catalog.id, { onDelete: "restrict" }),
  scalingType: scaling_type_enum("scaling_type").notNull(),
  vegetableKey: text("vegetable_key").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  originalQty: decimal("original_qty", { precision: 10, scale: 2 }).notNull(),
}, (table) => [
  index("listing_cycles_product_started_idx").on(table.productId, table.startedAt),
  index("listing_cycles_catalog_started_idx").on(table.vegetableCatalogId, table.startedAt),
  index("listing_cycles_catalog_unit_started_idx").on(table.vegetableCatalogId, table.scalingType, table.startedAt),
  index("listing_cycles_vegetable_started_idx").on(table.vegetableKey, table.startedAt),
]);

export const seller_promotion_stage = pgEnum("seller_promotion_stage", [
  "initial",
  "followup",
]);

export const seller_promotion_status = pgEnum("seller_promotion_status", [
  "waiting",
  "queued",
  "sent",
  "ready",
  "skipped",
  "failed",
]);

export const seller_promotion_jobs = pgTable("seller_promotion_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  listingCycleId: uuid("listing_cycle_id").notNull().references(() => listing_cycles.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  stage: seller_promotion_stage().notNull(),
  status: seller_promotion_status().default("waiting").notNull(),
  nextCheckAt: timestamp("next_check_at", { withTimezone: true }).defaultNow().notNull(),
  retryCount: integer("retry_count").default(0).notNull(),
  leaseUntil: timestamp("lease_until", { withTimezone: true }),
  headline: text("headline"),
  caption: text("caption"),
  visibilityPolicyVersion: text("visibility_policy_version"),
  visibilityScore: decimal("visibility_score", { precision: 5, scale: 4 }),
  visibilityTier: text("visibility_tier"),
  visibilityRank: integer("visibility_rank"),
  evaluatedAt: timestamp("evaluated_at", { withTimezone: true }),
  readyAt: timestamp("ready_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  readAt: timestamp("read_at", { withTimezone: true }),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [
  uniqueIndex("seller_promotion_jobs_cycle_stage_unique").on(table.listingCycleId, table.stage),
  index("seller_promotion_jobs_due_idx").on(table.status, table.nextCheckAt),
  index("seller_promotion_jobs_seller_created_idx").on(table.sellerId, table.createdAt),
  index("seller_promotion_jobs_seller_read_created_idx").on(table.sellerId, table.readAt, table.createdAt),
]);

export const social_platform = pgEnum("social_platform", ["facebook", "instagram", "tiktok", "x"]);
export const social_campaign_status = pgEnum("social_campaign_status", [
  "draft", "queued", "publishing", "processing", "published", "partial", "failed",
]);
export const social_campaign_post_status = pgEnum("social_campaign_post_status", [
  "queued", "processing", "published", "failed",
]);

export const seller_social_campaigns = pgTable("seller_social_campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "cascade" }),
  listingCycleId: uuid("listing_cycle_id").notNull().references(() => listing_cycles.id, { onDelete: "cascade" }),
  status: social_campaign_status().default("draft").notNull(),
  posts: jsonb("posts").$type<Record<string, string>>().notNull(),
  selectedPlatforms: social_platform("selected_platforms").array().default([]).notNull(),
  tiktokPrivacyLevel: text("tiktok_privacy_level"),
  tiktokAllowComment: boolean("tiktok_allow_comment"),
  tiktokBrandOrganic: boolean("tiktok_brand_organic"),
  tiktokBrandContent: boolean("tiktok_brand_content"),
  tiktokConsentAt: timestamp("tiktok_consent_at", { withTimezone: true }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  retryCount: integer("retry_count").default(0).notNull(),
  leaseUntil: timestamp("lease_until", { withTimezone: true }),
  nextCheckAt: timestamp("next_check_at", { withTimezone: true }).defaultNow().notNull(),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [
  index("seller_social_campaigns_seller_created_idx").on(table.sellerId, table.createdAt),
  index("seller_social_campaigns_due_idx").on(table.status, table.nextCheckAt, table.leaseUntil),
]);

export const seller_social_campaign_posts = pgTable("seller_social_campaign_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id").notNull().references(() => seller_social_campaigns.id, { onDelete: "cascade" }),
  platform: social_platform().notNull(),
  status: social_campaign_post_status().default("queued").notNull(),
  platformPostId: text("platform_post_id"),
  postUrl: text("post_url"),
  lastError: text("last_error"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [
  uniqueIndex("seller_social_campaign_posts_campaign_platform_unique").on(table.campaignId, table.platform),
  index("seller_social_campaign_posts_campaign_idx").on(table.campaignId, table.status),
]);

export const seller_boost_reason_enum = pgEnum("seller_boost_reason", [
  "initial",
  "price_reduction",
]);
export const seller_boost_status_enum = pgEnum("seller_boost_status", [
  "prompt",
  "queued",
  "sent",
  "failed",
  "dismissed",
]);

export const seller_visibility_boosts = pgTable("seller_visibility_boosts", {
  id: uuid("id").defaultRandom().primaryKey(),
  listingCycleId: uuid("listing_cycle_id").notNull().references(() => listing_cycles.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  reason: seller_boost_reason_enum("reason").notNull(),
  reductionPeriod: integer("reduction_period").default(0).notNull(),
  boostKey: text("boost_key").notNull(),
  status: seller_boost_status_enum().default("queued").notNull(),
  retryCount: integer("retry_count").default(0).notNull(),
  leaseUntil: timestamp("lease_until", { withTimezone: true }),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }).defaultNow().notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  priceBefore: decimal("price_before", { precision: 10, scale: 2 }),
  priceAfter: decimal("price_after", { precision: 10, scale: 2 }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [
  uniqueIndex("seller_visibility_boosts_key_unique").on(table.boostKey),
  index("seller_visibility_boosts_due_idx").on(table.status, table.nextAttemptAt),
  index("seller_visibility_boosts_seller_created_idx").on(table.sellerId, table.createdAt),
  index("seller_visibility_boosts_seller_read_created_idx").on(table.sellerId, table.readAt, table.createdAt),
]);

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
  completedAt: timestamp("completed_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  expiredAt: timestamp("expired_at", { withTimezone: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [
  index("orders_buyers_id_created_at_idx").on(table.buyersId, table.createdAt),
  index("orders_sellers_id_created_at_idx").on(table.sellersId, table.createdAt),
  index("orders_status_expires_at_idx").on(table.status, table.expiresAt),
]);

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

export const order_report_evidence = pgTable("order_report_evidence", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id").notNull().references(() => order_reports.id, { onDelete: "cascade" }),
  objectKey: text("object_key").notNull().unique(),
  contentType: text("content_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("order_report_evidence_report_created_idx").on(table.reportId, table.createdAt)]);

export const product_inquiries = pgTable("product_inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "cascade" }),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  reply: text("reply"),
  repliedAt: timestamp("replied_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("product_inquiries_one_open_per_buyer_product_idx")
    .on(table.productId, table.buyerId)
    .where(sql`${table.repliedAt} is null`),
  index("product_inquiries_seller_created_idx").on(table.sellerId, table.createdAt),
  index("product_inquiries_buyer_product_idx").on(table.buyerId, table.productId, table.createdAt),
]);

export const conversation_context_enum = pgEnum("conversation_context", ["product", "order", "seller"]);
export const conversation_status_enum = pgEnum("conversation_status", ["open", "closed"]);

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  contextType: conversation_context_enum("context_type").notNull(),
  contextKey: text("context_key").notNull().unique(),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => sellers_product.id, { onDelete: "set null" }),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }),
  status: conversation_status_enum().default("open").notNull(),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [
  index("conversations_buyer_last_message_idx").on(table.buyerId, table.lastMessageAt),
  index("conversations_seller_last_message_idx").on(table.sellerId, table.lastMessageAt),
  index("conversations_product_idx").on(table.productId),
  index("conversations_order_idx").on(table.orderId),
]);

export const conversation_participants = pgTable("conversation_participants", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  lastReadAt: timestamp("last_read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("conversation_participants_conversation_user_unique").on(table.conversationId, table.userId),
  index("conversation_participants_user_idx").on(table.userId, table.lastReadAt),
]);

export const conversation_messages = pgTable("conversation_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  clientMessageId: text("client_message_id").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("conversation_messages_client_id_unique").on(table.conversationId, table.clientMessageId),
  index("conversation_messages_conversation_created_idx").on(table.conversationId, table.createdAt),
]);

export const trust_events = pgTable("trust_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventKey: text("event_key").notNull().unique(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  classification: text("classification").notNull(),
  sourceId: uuid("source_id"),
  policyVersion: text("policy_version").notNull().default("v1-warning-only"),
  invalidatedAt: timestamp("invalidated_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("trust_events_monitor_subject_idx").on(table.subjectId, table.classification, table.invalidatedAt),
  index("trust_events_monitor_global_idx").on(table.classification, table.invalidatedAt),
]);

export const trust_notices = pgTable("trust_notices", {
  id: uuid("id").defaultRandom().primaryKey(),
  noticeKey: text("notice_key").notNull().unique(),
  recipientId: text("recipient_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  readAt: timestamp("read_at", { withTimezone: true }),
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

export const trust_actions = pgTable("trust_actions", {
  id: uuid("id").defaultRandom().primaryKey(),
  actionKey: text("action_key").notNull().unique(),
  subjectId: text("subject_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  actionType: text("action_type").notNull(),
  weightedPoints: integer("weighted_points").notNull(),
  policyVersion: text("policy_version").notNull(),
  reason: text("reason").notNull(),
  sourceEventId: uuid("source_event_id").references(() => trust_events.id, { onDelete: "set null" }),
  sourceOrderId: uuid("source_order_id").references(() => orders.id, { onDelete: "set null" }),
  startsAt: timestamp("starts_at", { withTimezone: true }).defaultNow().notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  revokedBy: text("revoked_by").references(() => user.id, { onDelete: "set null" }),
  revocationReason: text("revocation_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("trust_actions_subject_active_idx").on(table.subjectId, table.actionType, table.revokedAt, table.endsAt),
  index("trust_actions_source_order_idx").on(table.sourceOrderId),
]);

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
}, (table) => [
  index("ordered_items_orders_id_idx").on(table.ordersId),
  index("ordered_items_product_id_idx").on(table.productId),
]);

export const product_reviews = pgTable("product_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  orderedItemId: uuid("ordered_item_id").notNull().unique().references(() => ordered_items.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => sellers_product.id, { onDelete: "restrict" }),
  buyerId: text("buyer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  sellerId: text("seller_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  rating: smallint("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("product_reviews_product_created_idx").on(table.productId, table.createdAt),
]);
