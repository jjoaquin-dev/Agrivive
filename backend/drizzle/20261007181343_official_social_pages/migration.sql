UPDATE "seller_social_campaign_posts"
SET "status" = 'failed',
	"last_error" = 'Seller account publishing has been retired',
	"completed_at" = now(),
	"updated_at" = now()
WHERE "status" IN ('queued', 'processing');--> statement-breakpoint
UPDATE "seller_social_campaigns"
SET "status" = 'failed',
	"last_error" = 'Seller account publishing has been retired',
	"completed_at" = now(),
	"updated_at" = now()
WHERE "status" IN ('queued', 'publishing', 'processing');--> statement-breakpoint
DROP TABLE "seller_social_accounts";--> statement-breakpoint
DROP TABLE "seller_social_oauth_states";--> statement-breakpoint
ALTER TABLE "seller_social_campaigns" DROP COLUMN "selected_account_ids";--> statement-breakpoint
DROP TYPE "social_oauth_provider";
