CREATE TABLE "buyer_listing_notices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"buyer_id" text NOT NULL,
	"event_id" uuid NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_follows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"buyer_id" text NOT NULL,
	"seller_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_listing_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"seller_id" text NOT NULL,
	"shop_name" text NOT NULL,
	"product_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "buyer_listing_notices_buyer_event_unique" ON "buyer_listing_notices" ("buyer_id","event_id");--> statement-breakpoint
CREATE INDEX "buyer_listing_notices_buyer_created_idx" ON "buyer_listing_notices" ("buyer_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "seller_follows_buyer_seller_unique" ON "seller_follows" ("buyer_id","seller_id");--> statement-breakpoint
CREATE INDEX "seller_follows_seller_created_idx" ON "seller_follows" ("seller_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "seller_listing_events_product_unique" ON "seller_listing_events" ("product_id");--> statement-breakpoint
CREATE INDEX "seller_listing_events_pending_idx" ON "seller_listing_events" ("processed_at","created_at");--> statement-breakpoint
ALTER TABLE "buyer_listing_notices" ADD CONSTRAINT "buyer_listing_notices_buyer_id_user_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "buyer_listing_notices" ADD CONSTRAINT "buyer_listing_notices_event_id_seller_listing_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "seller_listing_events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_follows" ADD CONSTRAINT "seller_follows_buyer_id_user_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_follows" ADD CONSTRAINT "seller_follows_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_listing_events" ADD CONSTRAINT "seller_listing_events_product_id_sellers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "sellers_product"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_listing_events" ADD CONSTRAINT "seller_listing_events_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
INSERT INTO "seller_listing_events" ("product_id", "seller_id", "shop_name", "product_name", "created_at", "processed_at")
SELECT product."id", product."user_id", COALESCE(profile."shop_name", 'Seller'),
  product."product_name", now(), now()
FROM "sellers_product" AS product
LEFT JOIN LATERAL (
  SELECT "shop_name" FROM "sellers_profile"
  WHERE "user_id" = product."user_id" AND "is_current" = true
  LIMIT 1
) AS profile ON true;
