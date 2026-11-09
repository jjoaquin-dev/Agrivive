-- Followers also get an email about updates from the sellers they follow.
ALTER TABLE "buyer_listing_notices" ADD COLUMN "email_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "buyer_listing_notices" ADD COLUMN "email_attempts" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
-- Notices made before this change are not emailed.
UPDATE "buyer_listing_notices" SET "email_sent_at" = "created_at";--> statement-breakpoint
CREATE INDEX "buyer_listing_notices_email_pending_idx" ON "buyer_listing_notices" ("created_at") WHERE "email_sent_at" IS NULL;
