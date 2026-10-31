ALTER TABLE "seller_visibility_boosts" ADD COLUMN IF NOT EXISTS "follow_up_due_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "seller_visibility_boosts" ADD COLUMN IF NOT EXISTS "follow_up_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "seller_visibility_boosts_follow_up_idx" ON "seller_visibility_boosts" ("follow_up_due_at");
