ALTER TYPE "role" ADD VALUE 'stakeholder';--> statement-breakpoint
CREATE TABLE "order_report_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"report_id" uuid NOT NULL,
	"object_key" text NOT NULL UNIQUE,
	"content_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"buyer_id" text NOT NULL,
	"seller_id" text NOT NULL,
	"question" text NOT NULL,
	"reply" text,
	"replied_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sellers_product" ADD COLUMN "storage_temperature_c" double precision;--> statement-breakpoint
CREATE INDEX "order_report_evidence_report_created_idx" ON "order_report_evidence" ("report_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "product_inquiries_one_open_per_buyer_product_idx" ON "product_inquiries" ("product_id","buyer_id") WHERE "replied_at" is null;--> statement-breakpoint
CREATE INDEX "product_inquiries_seller_created_idx" ON "product_inquiries" ("seller_id","created_at");--> statement-breakpoint
CREATE INDEX "product_inquiries_buyer_product_idx" ON "product_inquiries" ("buyer_id","product_id","created_at");--> statement-breakpoint
ALTER TABLE "order_report_evidence" ADD CONSTRAINT "order_report_evidence_report_id_order_reports_id_fkey" FOREIGN KEY ("report_id") REFERENCES "order_reports"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_inquiries" ADD CONSTRAINT "product_inquiries_product_id_sellers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "sellers_product"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_inquiries" ADD CONSTRAINT "product_inquiries_buyer_id_user_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_inquiries" ADD CONSTRAINT "product_inquiries_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;