CREATE INDEX "listing_cycles_product_started_idx" ON "listing_cycles" ("product_id","started_at");--> statement-breakpoint
CREATE INDEX "listing_cycles_vegetable_started_idx" ON "listing_cycles" ("vegetable_key","started_at");--> statement-breakpoint
CREATE INDEX "sellers_product_marketplace_visibility_idx" ON "sellers_product" ("is_active","is_marketable","published_at");--> statement-breakpoint
CREATE INDEX "trust_events_monitor_subject_idx" ON "trust_events" ("subject_id","classification","invalidated_at");--> statement-breakpoint
CREATE INDEX "trust_events_monitor_global_idx" ON "trust_events" ("classification","invalidated_at");