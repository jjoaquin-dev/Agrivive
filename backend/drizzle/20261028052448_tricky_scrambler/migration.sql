CREATE TABLE "fb_post_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"post_type" text NOT NULL,
	"facebook_post_id" text,
	"price" numeric(10,2) NOT NULL,
	"posted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "fb_post_logs_product_idx" ON "fb_post_logs" ("product_id","posted_at");--> statement-breakpoint
ALTER TABLE "fb_post_logs" ADD CONSTRAINT "fb_post_logs_product_id_sellers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "sellers_product"("id") ON DELETE CASCADE;