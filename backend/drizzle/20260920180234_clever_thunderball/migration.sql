CREATE TABLE "listing_cycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"original_qty" numeric(10,2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_id" uuid NOT NULL,
	"buyer_id" text NOT NULL,
	"seller_id" text NOT NULL,
	"question" text NOT NULL,
	"reply" text,
	"replied_at" timestamp with time zone,
	"deadline_stage" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_id" uuid NOT NULL,
	"reporter_id" text NOT NULL,
	"subject_id" text NOT NULL,
	"reason" text NOT NULL,
	"details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_id" uuid NOT NULL UNIQUE,
	"buyer_id" text NOT NULL,
	"seller_id" text NOT NULL,
	"rating" smallint NOT NULL,
	"review" text,
	"seller_response" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seller_scan_grace" (
	"order_id" uuid PRIMARY KEY,
	"seller_id" text NOT NULL,
	"grace_until" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trust_corrections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid NOT NULL UNIQUE,
	"requester_id" text NOT NULL,
	"reason" text NOT NULL,
	"outcome" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trust_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_key" text NOT NULL UNIQUE,
	"order_id" uuid NOT NULL,
	"subject_id" text NOT NULL,
	"kind" text NOT NULL,
	"classification" text NOT NULL,
	"source_id" uuid,
	"policy_version" text DEFAULT 'v1-warning-only' NOT NULL,
	"invalidated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trust_notices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"notice_key" text NOT NULL UNIQUE,
	"recipient_id" text NOT NULL,
	"order_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "two_factor" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"secret" text,
	"backup_codes" text,
	"verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "cancelled_by" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "cancellation_reason" text;--> statement-breakpoint
ALTER TABLE "sellers_product" ADD COLUMN "original_qty" numeric(10,2);--> statement-breakpoint
ALTER TABLE "sellers_product" ADD COLUMN "inventory_received_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sellers_product" ADD COLUMN "published_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sellers_product" ADD COLUMN "is_marketable" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers_product" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers_profile" ADD COLUMN "is_current" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "two_factor_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "order_reports_order_reporter_unique" ON "order_reports" ("order_id","reporter_id");--> statement-breakpoint
ALTER TABLE "listing_cycles" ADD CONSTRAINT "listing_cycles_product_id_sellers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "sellers_product"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_inquiries" ADD CONSTRAINT "order_inquiries_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_inquiries" ADD CONSTRAINT "order_inquiries_buyer_id_user_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_inquiries" ADD CONSTRAINT "order_inquiries_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_reports" ADD CONSTRAINT "order_reports_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_reports" ADD CONSTRAINT "order_reports_reporter_id_user_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_reports" ADD CONSTRAINT "order_reports_subject_id_user_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_reviews" ADD CONSTRAINT "order_reviews_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_reviews" ADD CONSTRAINT "order_reviews_buyer_id_user_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_reviews" ADD CONSTRAINT "order_reviews_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_scan_grace" ADD CONSTRAINT "seller_scan_grace_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "seller_scan_grace" ADD CONSTRAINT "seller_scan_grace_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trust_corrections" ADD CONSTRAINT "trust_corrections_event_id_trust_events_id_fkey" FOREIGN KEY ("event_id") REFERENCES "trust_events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trust_corrections" ADD CONSTRAINT "trust_corrections_requester_id_user_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trust_events" ADD CONSTRAINT "trust_events_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trust_events" ADD CONSTRAINT "trust_events_subject_id_user_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trust_notices" ADD CONSTRAINT "trust_notices_recipient_id_user_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "trust_notices" ADD CONSTRAINT "trust_notices_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;