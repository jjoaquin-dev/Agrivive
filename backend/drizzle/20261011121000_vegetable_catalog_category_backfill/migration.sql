-- The enum values are introduced by the preceding migration.
-- Drizzle executes pending migrations in one transaction, so the backfill
-- must run in a later migration after the enum changes have committed.
SELECT 1;
