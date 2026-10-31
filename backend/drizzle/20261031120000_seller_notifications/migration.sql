ALTER TYPE "notification_type" ADD VALUE IF NOT EXISTS 'seller_alert';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seller_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"kind" text NOT NULL,
	"order_id" uuid REFERENCES "orders"("id") ON DELETE CASCADE,
	"product_id" uuid REFERENCES "sellers_product"("id") ON DELETE CASCADE,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"dedupe_key" text NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "seller_notifications_dedupe_unique" ON "seller_notifications" ("dedupe_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "seller_notifications_seller_created_idx" ON "seller_notifications" ("seller_id", "created_at" DESC);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seller_notification_settings" (
	"seller_id" text PRIMARY KEY NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
	"stock_price" boolean DEFAULT true NOT NULL,
	"boost" boolean DEFAULT true NOT NULL,
	"account" boolean DEFAULT true NOT NULL,
	"night_mode" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
