ALTER TABLE "sellers_product" DROP COLUMN IF EXISTS "condition";
DROP TYPE IF EXISTS "product_condition";
ALTER TABLE "sellers_profile" DROP COLUMN IF EXISTS "pickup_capacity";
