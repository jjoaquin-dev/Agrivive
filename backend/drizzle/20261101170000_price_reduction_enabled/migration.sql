ALTER TABLE "sellers_product" ADD COLUMN IF NOT EXISTS "price_reduction_enabled" boolean DEFAULT true NOT NULL;
