-- Live events: each change below sends a small message on the "agrivive_live" channel.
-- pg_notify is part of the transaction, so nothing is sent for a change that rolls back.
-- The API listens and passes the message to open /ws/live sockets. Messages carry ids only.

CREATE OR REPLACE FUNCTION agrivive_live_order() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pg_notify('agrivive_live', json_build_object('k', 'order', 'id', NEW.id, 'b', NEW.buyers_id, 's', NEW.sellers_id)::text);
  RETURN NULL;
END $$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS orders_live_event ON "orders";
--> statement-breakpoint
CREATE TRIGGER orders_live_event AFTER INSERT OR UPDATE ON "orders"
  FOR EACH ROW EXECUTE FUNCTION agrivive_live_order();
--> statement-breakpoint

CREATE OR REPLACE FUNCTION agrivive_live_product() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pg_notify('agrivive_live', json_build_object('k', 'product', 'id', NEW.id, 's', NEW.user_id)::text);
  RETURN NULL;
END $$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS sellers_product_live_event ON "sellers_product";
--> statement-breakpoint
CREATE TRIGGER sellers_product_live_event AFTER UPDATE ON "sellers_product"
  FOR EACH ROW WHEN (
    OLD.product_qty IS DISTINCT FROM NEW.product_qty
    OR OLD.product_price IS DISTINCT FROM NEW.product_price
    OR OLD.is_active IS DISTINCT FROM NEW.is_active
    OR OLD.is_marketable IS DISTINCT FROM NEW.is_marketable
  ) EXECUTE FUNCTION agrivive_live_product();
--> statement-breakpoint

CREATE OR REPLACE FUNCTION agrivive_live_seller_notice() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pg_notify('agrivive_live', json_build_object('k', 'notice', 'u', NEW.seller_id, 'kind', NEW.kind)::text);
  RETURN NULL;
END $$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS seller_notifications_live_event ON "seller_notifications";
--> statement-breakpoint
CREATE TRIGGER seller_notifications_live_event AFTER INSERT ON "seller_notifications"
  FOR EACH ROW EXECUTE FUNCTION agrivive_live_seller_notice();
--> statement-breakpoint

CREATE OR REPLACE FUNCTION agrivive_live_trust_notice() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pg_notify('agrivive_live', json_build_object('k', 'notice', 'u', NEW.recipient_id, 'kind', NEW.kind)::text);
  RETURN NULL;
END $$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS trust_notices_live_event ON "trust_notices";
--> statement-breakpoint
CREATE TRIGGER trust_notices_live_event AFTER INSERT ON "trust_notices"
  FOR EACH ROW EXECUTE FUNCTION agrivive_live_trust_notice();
--> statement-breakpoint

CREATE OR REPLACE FUNCTION agrivive_live_listing_notice() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pg_notify('agrivive_live', json_build_object('k', 'notice', 'u', NEW.buyer_id, 'kind', 'listing')::text);
  RETURN NULL;
END $$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS buyer_listing_notices_live_event ON "buyer_listing_notices";
--> statement-breakpoint
CREATE TRIGGER buyer_listing_notices_live_event AFTER INSERT ON "buyer_listing_notices"
  FOR EACH ROW EXECUTE FUNCTION agrivive_live_listing_notice();
--> statement-breakpoint

CREATE OR REPLACE FUNCTION agrivive_live_message() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE convo RECORD;
BEGIN
  SELECT buyer_id, seller_id INTO convo FROM conversations WHERE id = NEW.conversation_id;
  IF FOUND THEN
    PERFORM pg_notify('agrivive_live', json_build_object('k', 'message', 'id', NEW.conversation_id, 'b', convo.buyer_id, 's', convo.seller_id)::text);
  END IF;
  RETURN NULL;
END $$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS conversation_messages_live_event ON "conversation_messages";
--> statement-breakpoint
CREATE TRIGGER conversation_messages_live_event AFTER INSERT ON "conversation_messages"
  FOR EACH ROW EXECUTE FUNCTION agrivive_live_message();
