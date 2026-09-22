ALTER TABLE "listing_cycles" ADD COLUMN "vegetable_key" text;--> statement-breakpoint
UPDATE "listing_cycles" AS cycle
SET "vegetable_key" = lower(regexp_replace(btrim(product."product_name"), '[[:space:]]+', ' ', 'g'))
FROM "sellers_product" AS product
WHERE cycle."product_id" = product."id";--> statement-breakpoint
ALTER TABLE "listing_cycles" ALTER COLUMN "vegetable_key" SET NOT NULL;
