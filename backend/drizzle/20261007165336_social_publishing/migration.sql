CREATE TYPE "social_campaign_post_status" AS ENUM('queued', 'processing', 'published', 'failed');--> statement-breakpoint
CREATE TYPE "social_campaign_status" AS ENUM('draft', 'queued', 'publishing', 'processing', 'published', 'partial', 'failed');--> statement-breakpoint
CREATE TYPE "social_oauth_provider" AS ENUM('meta', 'tiktok', 'x');--> statement-breakpoint
CREATE TYPE "social_platform" AS ENUM('facebook', 'instagram', 'tiktok', 'x');--> statement-breakpoint
CREATE TABLE "seller_social_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"seller_id" text NOT NULL,
	"provider" "social_oauth_provider" NOT NULL,
	"platform" "social_platform" NOT NULL,
	"provider_account_id" text NOT NULL,
	"display_name" text NOT NULL,
	"access_token_ciphertext" text NOT NULL,
	"refresh_token_ciphertext" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scopes" text[] DEFAULT '{}'::text[] NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"connected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_social_campaign_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"campaign_id" uuid NOT NULL,
	"platform" "social_platform" NOT NULL,
	"status" "social_campaign_post_status" DEFAULT 'queued'::"social_campaign_post_status" NOT NULL,
	"platform_post_id" text,
	"post_url" text,
	"last_error" text,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_social_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"seller_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"listing_cycle_id" uuid NOT NULL,
	"status" "social_campaign_status" DEFAULT 'draft'::"social_campaign_status" NOT NULL,
	"posts" jsonb NOT NULL,
	"selected_platforms" "social_platform"[] DEFAULT '{}'::"social_platform"[] NOT NULL,
	"selected_account_ids" text[] DEFAULT '{}'::text[] NOT NULL,
	"tiktok_privacy_level" text,
	"tiktok_allow_comment" boolean,
	"tiktok_brand_organic" boolean,
	"tiktok_brand_content" boolean,
	"tiktok_consent_at" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"lease_until" timestamp with time zone,
	"next_check_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_social_oauth_states" (
	"state_hash" text PRIMARY KEY,
	"seller_id" text NOT NULL,
	"provider" "social_oauth_provider" NOT NULL,
	"redirect_uri" text NOT NULL,
	"code_verifier_ciphertext" text,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "seller_social_accounts_identity_unique" ON "seller_social_accounts" ("seller_id","platform","provider_account_id");--> statement-breakpoint
CREATE INDEX "seller_social_accounts_seller_platform_idx" ON "seller_social_accounts" ("seller_id","platform","is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "seller_social_campaign_posts_campaign_platform_unique" ON "seller_social_campaign_posts" ("campaign_id","platform");--> statement-breakpoint
CREATE INDEX "seller_social_campaign_posts_campaign_idx" ON "seller_social_campaign_posts" ("campaign_id","status");--> statement-breakpoint
CREATE INDEX "seller_social_campaigns_seller_created_idx" ON "seller_social_campaigns" ("seller_id","created_at");--> statement-breakpoint
CREATE INDEX "seller_social_campaigns_due_idx" ON "seller_social_campaigns" ("status","next_check_at","lease_until");--> statement-breakpoint
CREATE INDEX "seller_social_oauth_states_expiry_idx" ON "seller_social_oauth_states" ("expires_at");--> statement-breakpoint
ALTER TABLE "seller_social_accounts" ADD CONSTRAINT "seller_social_accounts_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_social_campaign_posts" ADD CONSTRAINT "seller_social_campaign_posts_f3yKQTTQN0Yf_fkey" FOREIGN KEY ("campaign_id") REFERENCES "seller_social_campaigns"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_social_campaigns" ADD CONSTRAINT "seller_social_campaigns_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_social_campaigns" ADD CONSTRAINT "seller_social_campaigns_product_id_sellers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "sellers_product"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_social_campaigns" ADD CONSTRAINT "seller_social_campaigns_listing_cycle_id_listing_cycles_id_fkey" FOREIGN KEY ("listing_cycle_id") REFERENCES "listing_cycles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_social_oauth_states" ADD CONSTRAINT "seller_social_oauth_states_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;
