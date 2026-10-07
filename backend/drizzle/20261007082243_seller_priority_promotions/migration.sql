CREATE TYPE "seller_promotion_stage" AS ENUM('initial', 'followup');--> statement-breakpoint
CREATE TYPE "seller_promotion_status" AS ENUM('waiting', 'queued', 'sent', 'ready', 'skipped', 'failed');--> statement-breakpoint
CREATE TABLE "seller_promotion_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"listing_cycle_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"seller_id" text NOT NULL,
	"stage" "seller_promotion_stage" NOT NULL,
	"status" "seller_promotion_status" DEFAULT 'waiting'::"seller_promotion_status" NOT NULL,
	"next_check_at" timestamp with time zone DEFAULT now() NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"lease_until" timestamp with time zone,
	"headline" text,
	"caption" text,
	"ready_at" timestamp with time zone,
	"read_at" timestamp with time zone,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "seller_promotion_jobs_cycle_stage_unique" ON "seller_promotion_jobs" ("listing_cycle_id","stage");--> statement-breakpoint
CREATE INDEX "seller_promotion_jobs_due_idx" ON "seller_promotion_jobs" ("status","next_check_at");--> statement-breakpoint
CREATE INDEX "seller_promotion_jobs_seller_created_idx" ON "seller_promotion_jobs" ("seller_id","created_at");--> statement-breakpoint
CREATE INDEX "seller_promotion_jobs_seller_read_created_idx" ON "seller_promotion_jobs" ("seller_id","read_at","created_at");--> statement-breakpoint
ALTER TABLE "seller_promotion_jobs" ADD CONSTRAINT "seller_promotion_jobs_listing_cycle_id_listing_cycles_id_fkey" FOREIGN KEY ("listing_cycle_id") REFERENCES "listing_cycles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_promotion_jobs" ADD CONSTRAINT "seller_promotion_jobs_product_id_sellers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "sellers_product"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_promotion_jobs" ADD CONSTRAINT "seller_promotion_jobs_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;
--> statement-breakpoint
INSERT INTO "seller_promotion_jobs" (
	"listing_cycle_id", "product_id", "seller_id", "stage", "status",
	"next_check_at", "last_error", "created_at", "updated_at"
)
SELECT cycle."id", cycle."product_id", product."user_id", 'initial', 'skipped',
	now(), 'Historical listing cycle predates Priority Boost promotions', now(), now()
FROM "listing_cycles" AS cycle
INNER JOIN "sellers_product" AS product ON product."id" = cycle."product_id"
ON CONFLICT ("listing_cycle_id", "stage") DO NOTHING;
