import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { deleteSellerProfile } from "../services/seller.profile.delete";

export const sellerProfileDeleteRoute = new Elysia().use(sessionAuth)
  .delete("/profile", async ({ session, set, status }) => {
    try {
      await deleteSellerProfile(session.userId);
      set.status = 204;
      return;
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to archive seller profile" });
    }
  }, { role: ["seller"] });
