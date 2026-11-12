import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_profile } from "../../../db/schema";
import type { StallSettingsBody } from "../model/pickup.stall";
import { readStall } from "./pickup.stall.read";

export async function saveStallSettings(sellerId: string, body: StallSettingsBody) {
  await db.update(sellers_profile).set({ pickupWithinMinutes: body.pickupWithinMinutes })
    .where(eq(sellers_profile.userId, sellerId));
  return readStall(sellerId);
}
