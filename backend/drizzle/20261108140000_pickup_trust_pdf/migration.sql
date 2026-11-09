-- Reservation pickup slots, 3-hour confirmation, QR window, pickup decline, no-show, reschedule and the PDF trust rules.
ALTER TYPE "order_status" ADD VALUE IF NOT EXISTS 'declined';--> statement-breakpoint
ALTER TABLE "sellers_profile" ADD COLUMN "pickup_capacity" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers_profile" ADD COLUMN "pickup_within_minutes" integer DEFAULT 120 NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers_profile" ADD COLUMN "closed_date" text;--> statement-breakpoint
ALTER TABLE "sellers_profile" ADD COLUMN "away_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sellers_profile" ADD COLUMN "away_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sellers_profile" ADD COLUMN "away_reason" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "pickup_start" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "pickup_end" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "confirmed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "confirmation_mode" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "packed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "ready_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "declined_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "no_show_at" timestamp with time zone;--> statement-breakpoint
-- Orders placed before pickup slots existed count as already confirmed so the 3-hour rule never touches them.
UPDATE "orders" SET "confirmed_at" = "created_at", "confirmation_mode" = 'manual' WHERE "status" = 'pending' AND "pickup_start" IS NULL;--> statement-breakpoint
CREATE INDEX "orders_pickup_range_idx" ON "orders" ("buyers_id", "pickup_start", "pickup_end");--> statement-breakpoint
CREATE INDEX "orders_seller_pickup_idx" ON "orders" ("sellers_id", "pickup_start");--> statement-breakpoint
ALTER TABLE "trust_events" ADD COLUMN "weight" integer;--> statement-breakpoint
ALTER TABLE "trust_events" ADD COLUMN "reason" text;--> statement-breakpoint
ALTER TABLE "trust_actions" ADD COLUMN "level" text;--> statement-breakpoint
ALTER TABLE "trust_notices" ADD COLUMN "detail" text;--> statement-breakpoint
ALTER TABLE "order_reports" ADD COLUMN "status" text DEFAULT 'submitted' NOT NULL;--> statement-breakpoint
ALTER TABLE "order_reports" ADD COLUMN "resolution" text;--> statement-breakpoint
ALTER TABLE "order_reports" ADD COLUMN "resolved_at" timestamp with time zone;--> statement-breakpoint
CREATE TABLE "seller_opening_hours" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "seller_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "weekday" smallint NOT NULL,
  "is_closed" boolean DEFAULT false NOT NULL,
  "opens_minute" smallint NOT NULL,
  "closes_minute" smallint NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX "seller_opening_hours_day_unique" ON "seller_opening_hours" ("seller_id", "weekday");--> statement-breakpoint
CREATE TABLE "seller_away_periods" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "seller_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "started_at" timestamp with time zone NOT NULL,
  "ended_at" timestamp with time zone,
  "reason" text
);--> statement-breakpoint
CREATE INDEX "seller_away_periods_seller_idx" ON "seller_away_periods" ("seller_id", "started_at");--> statement-breakpoint
CREATE TABLE "order_status_history" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "status" text NOT NULL,
  "actor_id" text,
  "note" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "order_status_history_order_idx" ON "order_status_history" ("order_id", "created_at");--> statement-breakpoint
CREATE TABLE "order_qr_scans" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid REFERENCES "orders"("id") ON DELETE CASCADE,
  "seller_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "result" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "order_qr_scans_order_idx" ON "order_qr_scans" ("order_id", "created_at");--> statement-breakpoint
CREATE TABLE "order_declines" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL UNIQUE REFERENCES "orders"("id") ON DELETE CASCADE,
  "buyer_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "seller_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "reason" text NOT NULL,
  "reason_valid" boolean NOT NULL,
  "details" text,
  "items" jsonb NOT NULL,
  "is_full" boolean NOT NULL,
  "photo_key" text NOT NULL,
  "photo_hash" text NOT NULL,
  "photo_reused" boolean DEFAULT false NOT NULL,
  "declined_at" timestamp with time zone DEFAULT now() NOT NULL,
  "seller_due_at" timestamp with time zone NOT NULL,
  "seller_response" text,
  "seller_photo_key" text,
  "seller_note" text,
  "seller_responded_at" timestamp with time zone,
  "status" text DEFAULT 'pending_seller' NOT NULL,
  "decided_at" timestamp with time zone
);--> statement-breakpoint
CREATE INDEX "order_declines_status_idx" ON "order_declines" ("status", "seller_due_at");--> statement-breakpoint
CREATE TABLE "buyer_no_shows" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL UNIQUE REFERENCES "orders"("id") ON DELETE CASCADE,
  "buyer_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "marked_by" text NOT NULL,
  "sequence" integer NOT NULL,
  "weight" integer NOT NULL,
  "excused" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "buyer_no_shows_buyer_idx" ON "buyer_no_shows" ("buyer_id", "created_at");--> statement-breakpoint
CREATE TABLE "order_excuses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL UNIQUE REFERENCES "orders"("id") ON DELETE CASCADE,
  "buyer_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "reason" text NOT NULL,
  "details" text,
  "status" text DEFAULT 'pending' NOT NULL,
  "decided_by" text,
  "decided_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "order_excuses_buyer_idx" ON "order_excuses" ("buyer_id", "created_at");--> statement-breakpoint
CREATE TABLE "order_reschedules" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "proposed_by" text NOT NULL,
  "reason" text NOT NULL,
  "old_start" timestamp with time zone NOT NULL,
  "old_end" timestamp with time zone NOT NULL,
  "new_start" timestamp with time zone NOT NULL,
  "new_end" timestamp with time zone NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "responded_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "order_reschedules_order_idx" ON "order_reschedules" ("order_id", "created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "order_reschedules_one_pending" ON "order_reschedules" ("order_id") WHERE "status" = 'pending';--> statement-breakpoint
CREATE TABLE "trust_disputes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "event_id" uuid NOT NULL REFERENCES "trust_events"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "reason" text NOT NULL,
  "status" text NOT NULL,
  "decision" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "decided_at" timestamp with time zone
);--> statement-breakpoint
CREATE UNIQUE INDEX "trust_disputes_one_per_event" ON "trust_disputes" ("event_id");--> statement-breakpoint
CREATE INDEX "trust_disputes_status_idx" ON "trust_disputes" ("status", "created_at");--> statement-breakpoint
CREATE TABLE "seller_flags" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "seller_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "kind" text NOT NULL,
  "detail" text,
  "opened_at" timestamp with time zone DEFAULT now() NOT NULL,
  "closed_at" timestamp with time zone
);--> statement-breakpoint
CREATE UNIQUE INDEX "seller_flags_one_open" ON "seller_flags" ("seller_id", "kind") WHERE "closed_at" IS NULL;--> statement-breakpoint
CREATE INDEX "seller_flags_open_idx" ON "seller_flags" ("kind", "closed_at");--> statement-breakpoint
-- Low ratings now become trust events when the review is written (reason written, or 2nd low rating in 30 days).
INSERT INTO "trust_events" ("event_key", "order_id", "subject_id", "kind", "classification", "weight", "policy_version", "created_at")
SELECT 'low-rating:' || r."order_id", r."order_id", r."seller_id", 'low_rating', 'verified', 1, 'monitoring-v4', r."created_at"
FROM "order_reviews" r JOIN "orders" o ON o."id" = r."order_id"
WHERE r."rating" <= 2 AND o."status" = 'completed' AND length(btrim(coalesce(r."review", ''))) > 0
ON CONFLICT ("event_key") DO NOTHING;
