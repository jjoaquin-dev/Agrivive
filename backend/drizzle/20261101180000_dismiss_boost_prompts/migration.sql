-- "Boost again" prompts (made after a price drop) are not used any more. Mark the old ones skipped.
UPDATE "seller_visibility_boosts" SET "status" = 'dismissed', "updated_at" = now() WHERE "status" = 'prompt';
