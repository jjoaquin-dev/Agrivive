CREATE TYPE "order_status" AS ENUM('pending', 'completed', 'cancelled', 'expired');--> statement-breakpoint
CREATE TYPE "product_type" AS ENUM('Leafy Greens', 'Root and Tuber Vegetables', 'Bulb and Stem Vegetables', 'Flower Vegetables', 'Fruit Vegetables', 'Seeds and Legumes');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('seller', 'buyer', 'admin');--> statement-breakpoint
CREATE TYPE "scaling_type" AS ENUM('sack', 'kilo', 'pile');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checkouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"buyers_id" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"request_fingerprint" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ordered_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"orders_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"product_name" text,
	"scaling_type" "scaling_type",
	"quantity" numeric(10,2),
	"unit_price" numeric(10,2) NOT NULL,
	"subtotal" numeric(20,2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"checkout_id" uuid,
	"buyers_id" text NOT NULL,
	"sellers_id" text NOT NULL,
	"status" "order_status" DEFAULT 'pending'::"order_status" NOT NULL,
	"total_amount" numeric NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sellers_product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"product_name" text NOT NULL,
	"image_url" text,
	"product_price" numeric(10,2),
	"total_amount" numeric(10,2),
	"productType" "product_type" NOT NULL,
	"scalingType" "scaling_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sellers_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"shop_name" text NOT NULL,
	"detail_address" text NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"phone_number" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "role"[] DEFAULT '{buyer}'::"role"[],
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "checkouts_buyer_key_unique" ON "checkouts" ("buyers_id","idempotency_key");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_buyers_id_user_id_fkey" FOREIGN KEY ("buyers_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ordered_items" ADD CONSTRAINT "ordered_items_orders_id_orders_id_fkey" FOREIGN KEY ("orders_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ordered_items" ADD CONSTRAINT "ordered_items_product_id_sellers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "sellers_product"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_checkout_id_checkouts_id_fkey" FOREIGN KEY ("checkout_id") REFERENCES "checkouts"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyers_id_user_id_fkey" FOREIGN KEY ("buyers_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_sellers_id_user_id_fkey" FOREIGN KEY ("sellers_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sellers_product" ADD CONSTRAINT "sellers_product_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sellers_profile" ADD CONSTRAINT "sellers_profile_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;