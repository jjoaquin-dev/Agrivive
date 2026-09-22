import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { sellerProfileAvatarModel } from "../model/seller.profile.avatar";
import { updateSellerAvatar } from "../services/seller.profile.avatar";

export const sellerProfileAvatarRoute = new Elysia().use(sessionAuth)
  .post("/profile/avatar", async ({ session, body, status }) => {
    try {
      return await updateSellerAvatar(session.userId, body.file);
    } catch (error) {
      if (error instanceof OrderError) {
        return status(error.statusCode, { message: error.message });
      }
      console.error("[Seller Profile Avatar Error]:", error);
      return status(500, { message: (error as any)?.message || "Failed to upload avatar" });
    }
  }, {
    role: ["seller"],
    body: sellerProfileAvatarModel,
  });
