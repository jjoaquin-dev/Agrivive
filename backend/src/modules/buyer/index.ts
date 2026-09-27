import Elysia from "elysia";
import { buyerOrderCreateRoute } from "./index/buyer.order.create";
import { buyerOrderListRoute } from "./index/buyer.order.list";
import { buyerOrderGetRoute } from "./index/buyer.order.get";
import { buyerOrderCancelRoute } from "./index/buyer.order.cancel";
import { buyerInquiryRoute } from "./index/buyer.order.inquiry";
import { buyerReviewRoute } from "./index/buyer.order.review";
import { buyerReportRoute } from "./index/buyer.order.report";
import { buyerNoticesRoute } from "./index/buyer.notices.list";
import { buyerCheckoutCreateRoute } from "./index/buyer.checkout.create";
import { buyerProductInquiryRoute } from "./index/buyer.product.inquiry";

export const buyerRoute = new Elysia({ prefix: "/buyer" })
  .use(buyerCheckoutCreateRoute)
  .use(buyerOrderCreateRoute)
  .use(buyerOrderListRoute)
  .use(buyerOrderGetRoute)
  .use(buyerOrderCancelRoute)
  .use(buyerInquiryRoute)
  .use(buyerProductInquiryRoute)
  .use(buyerReviewRoute)
  .use(buyerReportRoute)
  .use(buyerNoticesRoute);
