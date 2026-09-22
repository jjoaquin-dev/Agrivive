import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { getSellerSetup } from "../services/seller.setup";

export const sellerSetupRoute = new Elysia().use(sessionAuth)
  .get("/setup", async ({ session, status }) => {
    try { return await getSellerSetup(session.userId); }
    catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error("Failed to read seller setup", error);
      return status(500, { message: "Failed to read seller setup" });
    }
  }, { role: ["buyer", "seller"] });
