ALTER TABLE "conversation_participants" ADD COLUMN IF NOT EXISTS "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD COLUMN IF NOT EXISTS "blocked_at" timestamp with time zone;
