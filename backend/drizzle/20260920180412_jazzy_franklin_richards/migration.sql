WITH ranked AS (
  SELECT id, row_number() OVER (PARTITION BY user_id ORDER BY updated_at DESC, created_at DESC, id DESC) AS position
  FROM sellers_profile
)
UPDATE sellers_profile AS profile
SET is_current = false
FROM ranked
WHERE profile.id = ranked.id AND ranked.position > 1;--> statement-breakpoint
CREATE UNIQUE INDEX "order_inquiries_one_open_per_order" ON "order_inquiries" ("order_id") WHERE "replied_at" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "sellers_profile_current_user_unique" ON "sellers_profile" ("user_id") WHERE "is_current" = true;
