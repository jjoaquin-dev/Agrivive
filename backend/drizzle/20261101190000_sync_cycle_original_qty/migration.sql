-- "Add More" used to raise only the product's original stock, not the current listing cycle's. Copy the larger product value to the current cycle.
UPDATE "listing_cycles" AS c
SET "original_qty" = p."original_qty"
FROM "sellers_product" AS p
WHERE p."id" = c."product_id"
  AND p."original_qty" IS NOT NULL
  AND p."original_qty" > c."original_qty"
  AND c."started_at" = (
    SELECT max(latest."started_at") FROM "listing_cycles" AS latest WHERE latest."product_id" = c."product_id"
  );
