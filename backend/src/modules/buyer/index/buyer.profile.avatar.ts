import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { buyerProfileAvatarModel } from "../model/buyer.profile.avatar";
import { updateBuyerAvatar } from "../services/buyer.profile.avatar";

export const buyerProfileAvatarRoute = new Elysia().use(sessionAuth)
  .post("/profile/avatar", async ({ session, body, status }) => {
    try {
      return await updateBuyerAvatar(session.userId, body.file);
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error("[Buyer Profile Avatar Error]:", error);
      return status(500, { message: (error as any)?.message || "Failed to upload avatar" });
    }
  }, {
    role: ["buyer"],
    body: buyerProfileAvatarModel,
  });
