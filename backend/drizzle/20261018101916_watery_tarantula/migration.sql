DO $$ BEGIN
  CREATE TYPE "seller_boost_reason" AS ENUM('initial', 'price_reduction');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "seller_boost_status" AS ENUM('prompt', 'queued', 'sent', 'failed', 'dismissed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
ALTER TYPE "notification_type" ADD VALUE IF NOT EXISTS 'seller_boost';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seller_visibility_boosts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
ALTER TABLE "seller_promotion_jobs" ADD COLUMN IF NOT EXISTS "visibility_policy_version" text;--> statement-breakpoint
ALTER TABLE "seller_promotion_jobs" ADD COLUMN IF NOT EXISTS "visibility_score" numeric(5,4);--> statement-breakpoint
ALTER TABLE "seller_promotion_jobs" ADD COLUMN IF NOT EXISTS "visibility_tier" text;--> statement-breakpoint
ALTER TABLE "seller_promotion_jobs" ADD COLUMN IF NOT EXISTS "visibility_rank" integer;--> statement-breakpoint
ALTER TABLE "seller_promotion_jobs" ADD COLUMN IF NOT EXISTS "evaluated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "seller_promotion_jobs" ADD COLUMN IF NOT EXISTS "completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "last_active_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "trust_events" ALTER COLUMN "order_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "trust_notices" ALTER COLUMN "order_id" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "seller_visibility_boosts_key_unique" ON "seller_visibility_boosts" ("boost_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "seller_visibility_boosts_due_idx" ON "seller_visibility_boosts" ("status","next_attempt_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "seller_visibility_boosts_seller_created_idx" ON "seller_visibility_boosts" ("seller_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "seller_visibility_boosts_seller_read_created_idx" ON "seller_visibility_boosts" ("seller_id","read_at","created_at");