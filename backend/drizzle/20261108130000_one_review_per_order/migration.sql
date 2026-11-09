-- One review per completed order: product stars, service stars, one comment, optional photo, editable for a short time.
-- "rating" keeps its meaning and is now the service stars. Old reviews have no product stars.
ALTER TABLE "order_reviews" ADD COLUMN "product_rating" smallint;--> statement-breakpoint
ALTER TABLE "order_reviews" ADD COLUMN "photo_key" text;--> statement-breakpoint
ALTER TABLE "order_reviews" ADD COLUMN "updated_at" timestamp with time zone;
