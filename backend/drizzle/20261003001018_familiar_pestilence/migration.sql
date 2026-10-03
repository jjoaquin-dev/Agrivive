CREATE TABLE "buyer_saved_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"buyer_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "buyer_saved_products_buyer_product_unique" ON "buyer_saved_products" ("buyer_id","product_id");--> statement-breakpoint
CREATE INDEX "buyer_saved_products_buyer_created_idx" ON "buyer_saved_products" ("buyer_id","created_at");--> statement-breakpoint
ALTER TABLE "buyer_saved_products" ADD CONSTRAINT "buyer_saved_products_buyer_id_user_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "buyer_saved_products" ADD CONSTRAINT "buyer_saved_products_product_id_sellers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "sellers_product"("id") ON DELETE CASCADE;
