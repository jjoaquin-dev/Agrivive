CREATE TABLE "product_stock_adjustments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"seller_id" text NOT NULL,
	"delta" numeric(11,2) NOT NULL,
	"before_qty" numeric(10,2) NOT NULL,
	"after_qty" numeric(10,2) NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "product_stock_adjustments_product_created_idx" ON "product_stock_adjustments" ("product_id","created_at");--> statement-breakpoint
ALTER TABLE "product_stock_adjustments" ADD CONSTRAINT "product_stock_adjustments_product_id_sellers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "sellers_product"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "product_stock_adjustments" ADD CONSTRAINT "product_stock_adjustments_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE RESTRICT;