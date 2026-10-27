CREATE INDEX "ordered_items_orders_id_idx" ON "ordered_items" ("orders_id");--> statement-breakpoint
CREATE INDEX "ordered_items_product_id_idx" ON "ordered_items" ("product_id");--> statement-breakpoint
CREATE INDEX "orders_buyers_id_created_at_idx" ON "orders" ("buyers_id","created_at");--> statement-breakpoint
CREATE INDEX "orders_sellers_id_created_at_idx" ON "orders" ("sellers_id","created_at");--> statement-breakpoint
CREATE INDEX "orders_status_expires_at_idx" ON "orders" ("status","expires_at");--> statement-breakpoint
CREATE INDEX "sellers_product_user_id_created_at_idx" ON "sellers_product" ("user_id","created_at");