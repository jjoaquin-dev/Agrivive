ALTER TYPE "notification_type" ADD VALUE IF NOT EXISTS 'seller_boost';--> statement-breakpoint
CREATE TYPE "seller_boost_reason" AS ENUM('initial', 'price_reduction');--> statement-breakpoint
CREATE TYPE "seller_boost_status" AS ENUM('prompt', 'queued', 'sent', 'failed', 'dismissed');--> statement-breakpoint
CREATE TABLE "seller_visibility_boosts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_cycle_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"seller_id" text NOT NULL,
	"reason" "seller_boost_reason" NOT NULL,
	"reduction_period" integer DEFAULT 0 NOT NULL,
	"boost_key" text NOT NULL,
	"status" "seller_boost_status" DEFAULT 'queued'::"seller_boost_status" NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"lease_until" timestamp with time zone,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone,
	"price_before" numeric(10,2),
	"price_after" numeric(10,2),
	"sent_at" timestamp with time zone,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "seller_visibility_boosts_key_unique" ON "seller_visibility_boosts" ("boost_key");--> statement-breakpoint
CREATE INDEX "seller_visibility_boosts_due_idx" ON "seller_visibility_boosts" ("status","next_attempt_at");--> statement-breakpoint
CREATE INDEX "seller_visibility_boosts_seller_created_idx" ON "seller_visibility_boosts" ("seller_id","created_at");--> statement-breakpoint
CREATE INDEX "seller_visibility_boosts_seller_read_created_idx" ON "seller_visibility_boosts" ("seller_id","read_at","created_at");--> statement-breakpoint
ALTER TABLE "seller_visibility_boosts" ADD CONSTRAINT "seller_visibility_boosts_listing_cycle_id_listing_cycles_id_fkey" FOREIGN KEY ("listing_cycle_id") REFERENCES "listing_cycles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_visibility_boosts" ADD CONSTRAINT "seller_visibility_boosts_product_id_sellers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "sellers_product"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_visibility_boosts" ADD CONSTRAINT "seller_visibility_boosts_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;
