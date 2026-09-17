import { db } from "../../../db";
import { sellers_profile } from "../../../db/schema";
import { sellerModel } from "../model/addprofile.model";

export async function addProfileService(userId: string, body: sellerModel) {
  const [postSellerProfile] = await db
    .insert(sellers_profile)
    .values({
      ...body,
      userId: userId,
    })
    .returning();

  if (!postSellerProfile) {
    throw new Error("Failed to post seller");
  }
  return { user: postSellerProfile };
}
