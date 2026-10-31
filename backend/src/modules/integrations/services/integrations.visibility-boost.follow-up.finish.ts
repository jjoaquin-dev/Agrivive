import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { seller_visibility_boosts } from "../../../db/schema";

/** The 6-hour rule is over for this boost (second post saved, or the cut was skipped). */
export async function finishBoostFollowUp(boostId: string) {
  try {
    await db.update(seller_visibility_boosts).set({ followUpDueAt: null })
      .where(eq(seller_visibility_boosts.id, boostId));
  } catch (error) {
    console.error("Boost follow-up finish failed", { boostId, error });
  }
}
