CREATE TABLE "trust_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"action_key" text NOT NULL UNIQUE,
	"subject_id" text NOT NULL,
	"action_type" text NOT NULL,
	"weighted_points" integer NOT NULL,
	"policy_version" text NOT NULL,
	"reason" text NOT NULL,
	"source_event_id" uuid,
	"source_order_id" uuid,
	"starts_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ends_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"revoked_by" text,
	"revocation_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "trust_actions_subject_active_idx" ON "trust_actions" ("subject_id","action_type","revoked_at","ends_at");
--> statement-breakpoint
CREATE INDEX "trust_actions_source_order_idx" ON "trust_actions" ("source_order_id");
--> statement-breakpoint
ALTER TABLE "trust_actions" ADD CONSTRAINT "trust_actions_subject_id_user_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "user"("id") ON DELETE CASCADE;
--> statement-breakpoint
ALTER TABLE "trust_actions" ADD CONSTRAINT "trust_actions_source_event_id_trust_events_id_fkey" FOREIGN KEY ("source_event_id") REFERENCES "trust_events"("id") ON DELETE SET NULL;
--> statement-breakpoint
ALTER TABLE "trust_actions" ADD CONSTRAINT "trust_actions_source_order_id_orders_id_fkey" FOREIGN KEY ("source_order_id") REFERENCES "orders"("id") ON DELETE SET NULL;
--> statement-breakpoint
ALTER TABLE "trust_actions" ADD CONSTRAINT "trust_actions_revoked_by_user_id_fkey" FOREIGN KEY ("revoked_by") REFERENCES "user"("id") ON DELETE SET NULL;
