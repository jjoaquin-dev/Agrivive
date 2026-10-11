ALTER TABLE "listing_cycles" ADD COLUMN "vegetable_catalog_id" uuid;--> statement-breakpoint
ALTER TABLE "listing_cycles" ADD CONSTRAINT "listing_cycles_vegetable_catalog_id_fkey" FOREIGN KEY ("vegetable_catalog_id") REFERENCES "vegetable_catalog"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "listing_cycles_catalog_started_idx" ON "listing_cycles" USING btree ("vegetable_catalog_id","started_at");--> statement-breakpoint
UPDATE "listing_cycles" AS cycle
SET "vegetable_catalog_id" = product."vegetable_catalog_id"
FROM "sellers_product" AS product
WHERE cycle."product_id" = product."id"
  AND product."vegetable_catalog_id" IS NOT NULL;
