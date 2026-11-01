ALTER TABLE "seller_visibility_boosts" ADD COLUMN "priority_score" numeric(5, 4);--> statement-breakpoint
ALTER TABLE "seller_visibility_boosts" ADD COLUMN "priority_tier" text;--> statement-breakpoint
ALTER TABLE "seller_visibility_boosts" ADD COLUMN "price_drop_setup_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "seller_visibility_boosts" ADD COLUMN "price_drop_setup_notified_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "seller_visibility_boosts_setup_idx" ON "seller_visibility_boosts" USING btree ("price_drop_setup_at");
