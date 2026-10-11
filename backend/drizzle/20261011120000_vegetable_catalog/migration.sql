ALTER TYPE "product_type" RENAME TO "product_type_legacy";--> statement-breakpoint
CREATE TYPE "product_type" AS ENUM('Leafy Greens', 'Root and Tuber Vegetables', 'Bulb and Stem Vegetables', 'Flower Vegetables', 'Fruit Vegetables', 'Seeds and Legumes', 'Root Vegetables', 'Bulb Vegetables', 'Stem Vegetables', 'Pod Vegetables', 'Tuber Vegetables', 'Seed Vegetables');--> statement-breakpoint
ALTER TABLE "sellers_product" ALTER COLUMN "productType" TYPE "product_type" USING "productType"::text::"product_type";--> statement-breakpoint
DROP TYPE "product_type_legacy";--> statement-breakpoint
CREATE TYPE "vegetable_category" AS ENUM('Leafy Greens', 'Root Vegetables', 'Bulb Vegetables', 'Stem Vegetables', 'Flower Vegetables', 'Fruit Vegetables', 'Pod Vegetables', 'Tuber Vegetables', 'Seed Vegetables');--> statement-breakpoint
CREATE TYPE "vegetable_review_status" AS ENUM('draft', 'approved', 'inactive');--> statement-breakpoint
CREATE TABLE "vegetable_catalog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filipino_name" text NOT NULL,
	"english_name" text NOT NULL,
	"search_aliases" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"search_text" text NOT NULL,
	"category" "vegetable_category" NOT NULL,
	"scientific_name" text,
	"source_url" text NOT NULL,
	"review_status" "vegetable_review_status" DEFAULT 'approved' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	"updated_at" timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT "vegetable_catalog_filipino_name_unique" UNIQUE("filipino_name")
);--> statement-breakpoint
CREATE INDEX "vegetable_catalog_search_text_idx" ON "vegetable_catalog" USING btree ("search_text");--> statement-breakpoint
CREATE INDEX "vegetable_catalog_category_idx" ON "vegetable_catalog" USING btree ("category");--> statement-breakpoint
ALTER TABLE "sellers_product" ADD COLUMN "vegetable_catalog_id" uuid;--> statement-breakpoint
ALTER TABLE "sellers_product" ADD CONSTRAINT "sellers_product_vegetable_catalog_id_fkey" FOREIGN KEY ("vegetable_catalog_id") REFERENCES "vegetable_catalog"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sellers_product_vegetable_catalog_id_idx" ON "sellers_product" USING btree ("vegetable_catalog_id");--> statement-breakpoint
INSERT INTO "vegetable_catalog" ("id", "filipino_name", "english_name", "search_aliases", "search_text", "category", "scientific_name", "source_url") VALUES
('b0000000-0000-4000-8000-000000000001', 'Pechay', 'Bok choy', '["pak choi", "Chinese cabbage"]', 'pechay bok choy pak choi chinese cabbage', 'Leafy Greens', 'Brassica rapa subsp. chinensis', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000002', 'Kangkong', 'Water spinach', '["swamp cabbage", "ong choy"]', 'kangkong water spinach swamp cabbage ong choy', 'Leafy Greens', 'Ipomoea aquatica', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000003', 'Litsugas', 'Lettuce', '["salad greens"]', 'litsugas lettuce salad greens', 'Leafy Greens', 'Lactuca sativa', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000004', 'Spinach', 'Spinach', '["espinaka"]', 'spinach espinaka', 'Leafy Greens', 'Spinacia oleracea', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000005', 'Kale', 'Kale', '["leafy kale"]', 'kale leafy kale', 'Leafy Greens', 'Brassica oleracea var. sabellica', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000006', 'Mustasa', 'Mustard greens', '["mustard leaf"]', 'mustasa mustard greens mustard leaf', 'Leafy Greens', 'Brassica juncea', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000007', 'Karot', 'Carrot', '["carrots"]', 'karot carrot carrots', 'Root Vegetables', 'Daucus carota subsp. sativus', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000008', 'Labanos', 'Radish', '["radishes"]', 'labanos radish radishes', 'Root Vegetables', 'Raphanus sativus', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000009', 'Beetroot', 'Beet', '["beets"]', 'beetroot beet beets', 'Root Vegetables', 'Beta vulgaris', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000010', 'Singkamas', 'Jicama', '["yam bean", "turnip bean"]', 'singkamas jicama yam bean turnip bean', 'Root Vegetables', 'Pachyrhizus erosus', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000011', 'Sibuyas', 'Onion', '["red onion", "white onion"]', 'sibuyas onion red onion white onion', 'Bulb Vegetables', 'Allium cepa', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000012', 'Bawang', 'Garlic', '["garlic bulbs"]', 'bawang garlic garlic bulbs', 'Bulb Vegetables', 'Allium sativum', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000013', 'Sibuyas Tagalog', 'Shallot', '["shallots", "small onion"]', 'sibuyas tagalog shallot shallots small onion', 'Bulb Vegetables', 'Allium cepa aggregatum group', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000014', 'Sibuyas dahon', 'Spring onion', '["green onion", "scallion"]', 'sibuyas dahon spring onion green onion scallion', 'Bulb Vegetables', 'Allium fistulosum', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000015', 'Kintsay', 'Celery', '["celery stalk"]', 'kintsay celery celery stalk', 'Stem Vegetables', 'Apium graveolens', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000016', 'Asparagus', 'Asparagus', '["asparagus spear"]', 'asparagus asparagus spear', 'Stem Vegetables', 'Asparagus officinalis', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000017', 'Labong', 'Bamboo shoot', '["bamboo shoots"]', 'labong bamboo shoot bamboo shoots', 'Stem Vegetables', 'Bambusa vulgaris', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000018', 'Broccoli', 'Broccoli', '["broccoli head"]', 'broccoli broccoli head', 'Flower Vegetables', 'Brassica oleracea var. italica', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000019', 'Koliflower', 'Cauliflower', '["cauliflower"]', 'koliflower cauliflower', 'Flower Vegetables', 'Brassica oleracea var. botrytis', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000020', 'Kamatis', 'Tomato', '["tomatoes"]', 'kamatis tomato tomatoes', 'Fruit Vegetables', 'Solanum lycopersicum', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000021', 'Pepino', 'Cucumber', '["cucumbers"]', 'pepino cucumber cucumbers', 'Fruit Vegetables', 'Cucumis sativus', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000022', 'Talong', 'Eggplant', '["aubergine", "brinjal"]', 'talong eggplant aubergine brinjal', 'Fruit Vegetables', 'Solanum melongena', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000023', 'Siling kampana', 'Bell pepper', '["sweet pepper", "capsicum"]', 'siling kampana bell pepper sweet pepper capsicum', 'Fruit Vegetables', 'Capsicum annuum', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000024', 'Zucchini', 'Zucchini', '["courgette"]', 'zucchini courgette', 'Fruit Vegetables', 'Cucurbita pepo', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000025', 'Kalabasa', 'Squash', '["winter squash", "pumpkin"]', 'kalabasa squash winter squash pumpkin', 'Fruit Vegetables', 'Cucurbita maxima', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000026', 'Ampalaya', 'Bitter melon', '["bitter gourd", "balsam pear"]', 'ampalaya bitter melon bitter gourd balsam pear', 'Fruit Vegetables', 'Momordica charantia', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000027', 'Okra', 'Okra', '["lady finger", "gumbo"]', 'okra okra lady finger gumbo', 'Pod Vegetables', 'Abelmoschus esculentus', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000028', 'Sitaw', 'String bean', '["yardlong bean", "green bean"]', 'sitaw string bean yardlong bean green bean', 'Pod Vegetables', 'Vigna unguiculata subsp. sesquipedalis', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000029', 'Guisantes', 'Garden pea', '["peas", "green peas"]', 'guisantes garden pea peas green peas', 'Pod Vegetables', 'Pisum sativum', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000030', 'Snow peas', 'Snow pea', '["mangetout"]', 'snow peas snow pea mangetout', 'Pod Vegetables', 'Pisum sativum var. saccharatum', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000031', 'Patatas', 'Potato', '["potatoes"]', 'patatas potato potatoes', 'Tuber Vegetables', 'Solanum tuberosum', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000032', 'Kamote', 'Sweet potato', '["sweet potatoes"]', 'kamote sweet potato sweet potatoes', 'Root Vegetables', 'Ipomoea batatas', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000033', 'Ube', 'Purple yam', '["yam", "ube yam"]', 'ube purple yam yam ube yam', 'Tuber Vegetables', 'Dioscorea alata', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000034', 'Gabi', 'Taro', '["gabi root"]', 'gabi taro gabi root', 'Tuber Vegetables', 'Colocasia esculenta', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000035', 'Mais', 'Corn', '["sweet corn", "maize"]', 'mais corn sweet corn maize', 'Seed Vegetables', 'Zea mays', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000036', 'Monggo', 'Mung bean', '["munggo", "mung beans"]', 'monggo mung bean munggo mung beans', 'Seed Vegetables', 'Vigna radiata', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000037', 'Garbanzos', 'Chickpea', '["chickpeas", "garbanzo beans"]', 'garbanzos chickpea chickpeas garbanzo beans', 'Seed Vegetables', 'Cicer arietinum', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000038', 'Lentils', 'Lentil', '["lentil beans"]', 'lentils lentil lentil beans', 'Seed Vegetables', 'Lens culinaris', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000039', 'Dahon ng collard', 'Collard greens', '["collards"]', 'dahon ng collard collard greens collards', 'Leafy Greens', 'Brassica oleracea var. viridis', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000040', 'Chard', 'Swiss chard', '["rainbow chard"]', 'chard swiss chard rainbow chard', 'Leafy Greens', 'Beta vulgaris var. cicla', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000041', 'Arugula', 'Arugula', '["rocket"]', 'arugula rocket', 'Leafy Greens', 'Eruca vesicaria', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000042', 'Turnip', 'Turnip', '["turnips"]', 'turnip turnips', 'Root Vegetables', 'Brassica rapa subsp. rapa', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000043', 'Parsnip', 'Parsnip', '["parsnips"]', 'parsnip parsnips', 'Root Vegetables', 'Pastinaca sativa', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000044', 'Leeks', 'Leek', '["leek"]', 'leeks leek', 'Bulb Vegetables', 'Allium ampeloprasum var. porrum', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000045', 'Rhubarb', 'Rhubarb', '["rhubarb stalk"]', 'rhubarb rhubarb stalk', 'Stem Vegetables', 'Rheum rhabarbarum', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000046', 'Artichoke', 'Artichoke', '["artichokes"]', 'artichoke artichokes', 'Flower Vegetables', 'Cynara cardunculus var. scolymus', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000047', 'Bulaklak ng zucchini', 'Zucchini blossoms', '["zucchini flowers"]', 'bulaklak ng zucchini zucchini blossoms zucchini flowers', 'Flower Vegetables', 'Cucurbita pepo', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide'),
('b0000000-0000-4000-8000-000000000048', 'Jerusalem artichoke', 'Jerusalem artichoke', '["sunchoke", "sunchokes"]', 'jerusalem artichoke sunchoke sunchokes', 'Tuber Vegetables', 'Helianthus tuberosus', 'https://alliancebioversityciat.org/stories/types-of-vegetables-full-list-categories-classification-guide');--> statement-breakpoint
UPDATE "sellers_product" AS product
SET "vegetable_catalog_id" = catalog."id"
FROM "vegetable_catalog" AS catalog
WHERE lower(btrim(product."product_name")) IN (
	lower(catalog."filipino_name"),
	lower(catalog."english_name")
);--> statement-breakpoint
UPDATE "sellers_product" AS product
SET "productType" = catalog."category"::text::"product_type"
FROM "vegetable_catalog" AS catalog
WHERE product."vegetable_catalog_id" = catalog."id";
