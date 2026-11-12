import { db } from "../../../db";
import { readStallRules } from "../../../utils/pickup/availability";
import { CLOSING_BUFFER_MINUTES } from "../../../utils/pickup/rules";
import { reservationDeadline } from "../../../utils/pickup/reservation-deadline";

/** What the buyer is told before reserving: the stall's hours and the time the pickup must happen by. */
export async function readReservationTerms(sellerId: string, now = new Date()) {
  const rules = await readStallRules(db, sellerId);
  const deadline = reservationDeadline(rules, now);
  return {
    shopName: rules.shopName,
    is24Hours: deadline.is24Hours,
    opensMinute: deadline.opensMinute,
    closesMinute: deadline.closesMinute,
    closingBufferMinutes: deadline.is24Hours ? 0 : CLOSING_BUFFER_MINUTES,
    pickupBy: deadline.end.toISOString(),
    qrUntil: deadline.qrUntil.toISOString(),
  };
}
