ALTER TABLE "listing_cycles" ADD COLUMN "scaling_type" "scaling_type";--> statement-breakpoint
UPDATE "listing_cycles" AS cycle
SET "scaling_type" = product."scalingType"
FROM "sellers_product" AS product
WHERE cycle."product_id" = product."id";--> statement-breakpoint
ALTER TABLE "listing_cycles" ALTER COLUMN "scaling_type" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "listing_cycles_catalog_unit_started_idx" ON "listing_cycles" USING btree ("vegetable_catalog_id","scaling_type","started_at");
