-- Trust alignment with the paper: the 12h/24h/48h reply timers now also cover product questions and direct chats, and sellers can answer product reviews.
ALTER TABLE "product_inquiries" ADD COLUMN IF NOT EXISTS "deadline_stage" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
-- Questions that already exist were never timed. Mark them as done so the timers start only with new questions and nobody is penalised for old ones.
UPDATE "product_inquiries" SET "deadline_stage" = 3;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN IF NOT EXISTS "awaiting_reply_since" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN IF NOT EXISTS "deadline_stage" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "conversations_awaiting_reply_idx" ON "conversations" ("awaiting_reply_since") WHERE "awaiting_reply_since" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD COLUMN IF NOT EXISTS "seller_response" text;
