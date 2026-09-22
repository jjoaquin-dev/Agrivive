import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { listBuyerNotices } from "../services/buyer.notices.list";

export const buyerNoticesRoute = new Elysia().use(sessionAuth).get("/notices",
  async ({ session, status }) => {
    try { return await listBuyerNotices(session.userId); }
    catch (error) {
      console.error(error);
      return status(500, { message: "Failed to list notices" });
    }
  }, { role: ["buyer"] });
