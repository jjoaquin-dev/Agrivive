ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "completed_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "cancelled_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "expired_at" timestamptz;

UPDATE "orders"
SET "completed_at" = "updated_at"
WHERE "status" = 'completed' AND "completed_at" IS NULL;

UPDATE "orders"
SET "cancelled_at" = "updated_at"
WHERE "status" = 'cancelled' AND "cancelled_at" IS NULL;

UPDATE "orders"
SET "expired_at" = "updated_at"
WHERE "status" = 'expired' AND "expired_at" IS NULL;
