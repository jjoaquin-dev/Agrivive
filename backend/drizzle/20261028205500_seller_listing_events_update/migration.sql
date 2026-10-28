ALTER TABLE "seller_listing_events" ADD COLUMN IF NOT EXISTS "event_type" text DEFAULT 'new_listing' NOT NULL;--> statement-breakpoint
ALTER TABLE "seller_listing_events" ADD COLUMN IF NOT EXISTS "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
DROP INDEX IF EXISTS "seller_listing_events_product_unique";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "seller_listing_events_product_idx" ON "seller_listing_events" ("product_id", "event_type");
