CREATE TYPE "notification_device_platform" AS ENUM('android', 'ios', 'web');--> statement-breakpoint
CREATE TYPE "notification_outbox_status" AS ENUM('pending', 'processing', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "notification_type" AS ENUM('seller_message', 'buyer_message', 'seller_listing');--> statement-breakpoint
CREATE TABLE "notification_devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"platform" "notification_device_platform" NOT NULL,
	"push_token" text NOT NULL,
	"device_id" text,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"invalidated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "notification_outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"recipient_user_id" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"aggregation_key" text NOT NULL,
	"dedupe_key" text NOT NULL,
	"reference_id" text,
	"item_count" integer DEFAULT 1 NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "notification_outbox_status" DEFAULT 'pending' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"available_at" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX "notification_devices_push_token_unique" ON "notification_devices" ("push_token");--> statement-breakpoint
CREATE INDEX "notification_devices_user_enabled_idx" ON "notification_devices" ("user_id", "is_enabled");--> statement-breakpoint
CREATE UNIQUE INDEX "notification_outbox_dedupe_unique" ON "notification_outbox" ("dedupe_key");--> statement-breakpoint
CREATE INDEX "notification_outbox_pending_idx" ON "notification_outbox" ("status", "available_at", "created_at");--> statement-breakpoint
CREATE INDEX "notification_outbox_recipient_idx" ON "notification_outbox" ("recipient_user_id", "created_at");--> statement-breakpoint
ALTER TABLE "notification_devices" ADD CONSTRAINT "notification_devices_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notification_outbox" ADD CONSTRAINT "notification_outbox_recipient_user_id_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "user"("id") ON DELETE CASCADE;
