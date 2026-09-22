ALTER TABLE "two_factor" ADD COLUMN "failed_verification_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "two_factor" ADD COLUMN "locked_until" timestamp;--> statement-breakpoint
ALTER TABLE "two_factor" ALTER COLUMN "secret" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "two_factor" ALTER COLUMN "backup_codes" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "two_factor" ALTER COLUMN "verified" SET DEFAULT true;--> statement-breakpoint
CREATE INDEX "two_factor_user_id_idx" ON "two_factor" ("user_id");