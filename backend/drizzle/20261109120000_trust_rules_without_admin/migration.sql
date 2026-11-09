-- Flagging Rules Without Admin: review-bomb ignore mark, order-flood mark, and a missed pickup that always adds 2 points.
ALTER TABLE "order_reviews" ADD COLUMN "ignored_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "counts_for_ranking" boolean DEFAULT true NOT NULL;--> statement-breakpoint
-- Earlier first-miss events had 0 points. Under the new table every missed pickup adds 2.
UPDATE "buyer_no_shows" SET "weight" = 2 WHERE "weight" = 0;--> statement-breakpoint
UPDATE "trust_events" SET "weight" = 2, "reason" = 'Missed pickup' WHERE "kind" = 'buyer_failed_reservation' AND "weight" = 0;
