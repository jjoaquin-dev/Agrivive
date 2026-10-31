CREATE TABLE IF NOT EXISTS "instagram_post_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL REFERENCES "sellers_product"("id") ON DELETE CASCADE,
	"post_type" text NOT NULL,
	"instagram_post_id" text,
	"post_url" text,
	"price" numeric(10, 2) NOT NULL,
	"posted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "instagram_post_logs_product_idx" ON "instagram_post_logs" ("product_id", "posted_at");
