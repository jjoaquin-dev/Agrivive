ALTER TABLE "sellers_product" ADD COLUMN "auto_post_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers_product" ADD COLUMN "auto_post_accepted_at" timestamp with time zone;--> statement-breakpoint
-- Listings that already run automatic price drops keep running: the seller set the drop themselves.
UPDATE "sellers_product" SET "auto_post_enabled" = true, "auto_post_accepted_at" = now()
WHERE "price_reduction_enabled" = true AND "price_reduction_amount" > 0 AND "minimum_price" IS NOT NULL;
