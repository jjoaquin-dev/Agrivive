CREATE TYPE "conversation_context" AS ENUM('product', 'order');--> statement-breakpoint
CREATE TYPE "conversation_status" AS ENUM('open', 'closed');--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"context_type" "conversation_context" NOT NULL,
	"context_key" text NOT NULL UNIQUE,
	"buyer_id" text NOT NULL,
	"seller_id" text NOT NULL,
	"product_id" uuid,
	"order_id" uuid,
	"status" "conversation_status" DEFAULT 'open'::"conversation_status" NOT NULL,
	"last_message_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "conversation_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"conversation_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"last_read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "conversation_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"conversation_id" uuid NOT NULL,
	"sender_id" text NOT NULL,
	"client_message_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_participants_conversation_user_unique" ON "conversation_participants" ("conversation_id","user_id");--> statement-breakpoint
CREATE INDEX "conversation_participants_user_idx" ON "conversation_participants" ("user_id","last_read_at");--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_messages_client_id_unique" ON "conversation_messages" ("conversation_id","client_message_id");--> statement-breakpoint
CREATE INDEX "conversation_messages_conversation_created_idx" ON "conversation_messages" ("conversation_id","created_at");--> statement-breakpoint
CREATE INDEX "conversations_buyer_last_message_idx" ON "conversations" ("buyer_id","last_message_at");--> statement-breakpoint
CREATE INDEX "conversations_seller_last_message_idx" ON "conversations" ("seller_id","last_message_at");--> statement-breakpoint
CREATE INDEX "conversations_product_idx" ON "conversations" ("product_id");--> statement-breakpoint
CREATE INDEX "conversations_order_idx" ON "conversations" ("order_id");--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_buyer_id_user_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_seller_id_user_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_product_id_sellers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "sellers_product"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_conversations_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "conversation_messages" ADD CONSTRAINT "conversation_messages_conversation_id_conversations_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "conversation_messages" ADD CONSTRAINT "conversation_messages_sender_id_user_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
INSERT INTO "conversations" ("context_type", "context_key", "buyer_id", "seller_id", "product_id", "created_at", "updated_at", "last_message_at")
SELECT 'product', 'product:' || inquiry."product_id"::text || ':' || inquiry."buyer_id" || ':' || inquiry."seller_id",
       inquiry."buyer_id", inquiry."seller_id", inquiry."product_id", inquiry."created_at", inquiry."created_at", inquiry."created_at"
FROM "product_inquiries" AS inquiry
ON CONFLICT ("context_key") DO NOTHING;--> statement-breakpoint
INSERT INTO "conversations" ("context_type", "context_key", "buyer_id", "seller_id", "order_id", "created_at", "updated_at", "last_message_at")
SELECT 'order', 'order:' || inquiry."order_id"::text || ':' || inquiry."buyer_id" || ':' || inquiry."seller_id",
       inquiry."buyer_id", inquiry."seller_id", inquiry."order_id", inquiry."created_at", inquiry."created_at", inquiry."created_at"
FROM "order_inquiries" AS inquiry
ON CONFLICT ("context_key") DO NOTHING;--> statement-breakpoint
INSERT INTO "conversation_participants" ("conversation_id", "user_id")
SELECT "id", "buyer_id" FROM "conversations"
ON CONFLICT ("conversation_id", "user_id") DO NOTHING;--> statement-breakpoint
INSERT INTO "conversation_participants" ("conversation_id", "user_id")
SELECT "id", "seller_id" FROM "conversations"
ON CONFLICT ("conversation_id", "user_id") DO NOTHING;--> statement-breakpoint
INSERT INTO "conversation_messages" ("conversation_id", "sender_id", "client_message_id", "body", "created_at")
SELECT conversation."id", inquiry."buyer_id", 'legacy:product:' || inquiry."id"::text || ':question', inquiry."question", inquiry."created_at"
FROM "product_inquiries" AS inquiry
INNER JOIN "conversations" AS conversation
  ON conversation."context_key" = 'product:' || inquiry."product_id"::text || ':' || inquiry."buyer_id" || ':' || inquiry."seller_id"
ON CONFLICT ("conversation_id", "client_message_id") DO NOTHING;--> statement-breakpoint
INSERT INTO "conversation_messages" ("conversation_id", "sender_id", "client_message_id", "body", "created_at")
SELECT conversation."id", inquiry."seller_id", 'legacy:product:' || inquiry."id"::text || ':reply', inquiry."reply", COALESCE(inquiry."replied_at", inquiry."created_at")
FROM "product_inquiries" AS inquiry
INNER JOIN "conversations" AS conversation
  ON conversation."context_key" = 'product:' || inquiry."product_id"::text || ':' || inquiry."buyer_id" || ':' || inquiry."seller_id"
WHERE inquiry."reply" IS NOT NULL
ON CONFLICT ("conversation_id", "client_message_id") DO NOTHING;--> statement-breakpoint
INSERT INTO "conversation_messages" ("conversation_id", "sender_id", "client_message_id", "body", "created_at")
SELECT conversation."id", inquiry."buyer_id", 'legacy:order:' || inquiry."id"::text || ':question', inquiry."question", inquiry."created_at"
FROM "order_inquiries" AS inquiry
INNER JOIN "conversations" AS conversation
  ON conversation."context_key" = 'order:' || inquiry."order_id"::text || ':' || inquiry."buyer_id" || ':' || inquiry."seller_id"
ON CONFLICT ("conversation_id", "client_message_id") DO NOTHING;--> statement-breakpoint
INSERT INTO "conversation_messages" ("conversation_id", "sender_id", "client_message_id", "body", "created_at")
SELECT conversation."id", inquiry."seller_id", 'legacy:order:' || inquiry."id"::text || ':reply', inquiry."reply", COALESCE(inquiry."replied_at", inquiry."created_at")
FROM "order_inquiries" AS inquiry
INNER JOIN "conversations" AS conversation
  ON conversation."context_key" = 'order:' || inquiry."order_id"::text || ':' || inquiry."buyer_id" || ':' || inquiry."seller_id"
WHERE inquiry."reply" IS NOT NULL
ON CONFLICT ("conversation_id", "client_message_id") DO NOTHING;--> statement-breakpoint
UPDATE "conversations" AS conversation
SET "last_message_at" = latest."created_at",
    "updated_at" = latest."created_at"
FROM (
  SELECT "conversation_id", max("created_at") AS "created_at"
  FROM "conversation_messages"
  GROUP BY "conversation_id"
) AS latest
WHERE latest."conversation_id" = conversation."id";
