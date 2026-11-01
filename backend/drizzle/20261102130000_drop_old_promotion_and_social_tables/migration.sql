-- The old promotion jobs and the old social campaigns were replaced by the Boost flow (seller_visibility_boosts). Nothing reads or writes these tables any more, and no other table points at them.
-- Back them up first if the old rows matter: pg_dump -t seller_promotion_jobs -t seller_social_campaigns -t seller_social_campaign_posts
DROP TABLE IF EXISTS "seller_social_campaign_posts";--> statement-breakpoint
DROP TABLE IF EXISTS "seller_social_campaigns";--> statement-breakpoint
DROP TABLE IF EXISTS "seller_promotion_jobs";--> statement-breakpoint
DROP TYPE IF EXISTS "social_campaign_post_status";--> statement-breakpoint
DROP TYPE IF EXISTS "social_campaign_status";--> statement-breakpoint
DROP TYPE IF EXISTS "social_platform";--> statement-breakpoint
DROP TYPE IF EXISTS "seller_promotion_status";--> statement-breakpoint
DROP TYPE IF EXISTS "seller_promotion_stage";
