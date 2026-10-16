ALTER TABLE "seller_promotion_jobs"
  ADD COLUMN "visibility_policy_version" text,
  ADD COLUMN "visibility_score" numeric(5, 4),
  ADD COLUMN "visibility_tier" text,
  ADD COLUMN "visibility_rank" integer,
  ADD COLUMN "evaluated_at" timestamp with time zone,
  ADD COLUMN "completed_at" timestamp with time zone;
