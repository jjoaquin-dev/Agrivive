CREATE TYPE "product_type" AS ENUM('Leafy Greens', 'Root and Tuber Vegetables', 'Bulb and Stem Vegetables', 'Flower Vegetables', 'Fruit Vegetables', 'Seeds and Legumes');--> statement-breakpoint
CREATE TYPE "scaling_type" AS ENUM('sack', 'kilo', 'pile');--> statement-breakpoint
CREATE TABLE "sellers_product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"product_name" text NOT NULL,
	"image_url" text,
	"product_qty" smallint,
	"productType" "product_type" NOT NULL,
	"scalingType" "scaling_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "sellers_profile" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "sellers_product" ADD CONSTRAINT "sellers_product_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;