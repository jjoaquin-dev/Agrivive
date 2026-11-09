import { db } from "../../../db";
import { readPickupSlots } from "../../../utils/pickup/availability";

export async function readPickupSlotsForBuyer(buyerId: string, sellerId: string) {
  return readPickupSlots(db, sellerId, buyerId);
}
