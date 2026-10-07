import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { OrderError } from "../../../utils/order-types";
import { buyerNoticeParams } from "../model/buyer.notices";
import { readBuyerNotice } from "../services/buyer.notice.read";
import { readAllBuyerNotices } from "../services/buyer.notices.read-all";

function noticeFailure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
  console.error(error);
  return status(500, { message: "Notice operation failed" });
}

export const buyerNoticeReadRoute = new Elysia().use(sessionAuth)
  .post("/notices/:id/read", async ({ session, params, status }) => {
    try {
      return await readBuyerNotice(session.userId, params.id);
    } catch (error) {
      return noticeFailure(error, status);
    }
  }, { role: ["buyer"], params: buyerNoticeParams })
  .post("/notices/read-all", async ({ session, status }) => {
    try {
      return await readAllBuyerNotices(session.userId);
    } catch (error) {
      return noticeFailure(error, status);
    }
  }, { role: ["buyer"] });
