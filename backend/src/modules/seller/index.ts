import Elysia from "elysia";
import { sellerProductCreateRoute } from "./index/seller.product.create";
import { sellerProfileCreateRoute } from "./index/seller.profile.create";
import { sellerWeightedVisiblityRoute } from "./index/seller.weighted.surplus.visibility";
import { sellerOrdersRoute } from "./index/seller.scan-order";
import { sellerProfileReadRoute } from "./index/seller.profile.read";
import { sellerProfileUpdateRoute } from "./index/seller.profile.update";
import { sellerProfileDeleteRoute } from "./index/seller.profile.delete";
import { sellerProfileAvatarRoute } from "./index/seller.profile.avatar";
import { sellerProductsRoute } from "./index/seller.products";
import { sellerProductGetRoute } from "./index/seller.product.get";
import { sellerProductArchiveRoute } from "./index/seller.product.archive";
import { sellerProductReactivateRoute } from "./index/seller.product.reactivate";
import { sellerProductAdjustStockRoute } from "./index/seller.product.adjust-stock";
import { sellerCancelOrderRoute } from "./index/seller.order.cancel";
import { sellerInquiryRoute } from "./index/seller.order.inquiry";
import { sellerReviewRoute } from "./index/seller.order.review";
import { sellerReportRoute } from "./index/seller.order.report";
import { sellerTrustRoute } from "./index/seller.trust";
import { sellerSetupRoute } from "./index/seller.setup";
import { sellerProductImageRoute } from "./index/seller.product.image";
import { sellerStockAdjustmentListRoute } from "./index/seller.stock-adjustment.list";
import { sellerNotificationsRoute } from "./index/seller.notifications";

export const sellerRoute = new Elysia({ prefix: "/seller" })

  //routes
  .use(sellerSetupRoute)
  .use(sellerProfileCreateRoute)
  .use(sellerProfileAvatarRoute)
  .use(sellerProductCreateRoute)
  .use(sellerProductImageRoute)
  .use(sellerStockAdjustmentListRoute)
  .use(sellerWeightedVisiblityRoute)
  .use(sellerOrdersRoute)
  .use(sellerProfileReadRoute)
  .use(sellerProfileUpdateRoute)
  .use(sellerProfileDeleteRoute)
  .use(sellerProductsRoute)
  .use(sellerProductGetRoute)
  .use(sellerProductArchiveRoute)
  .use(sellerProductReactivateRoute)
  .use(sellerProductAdjustStockRoute)
  .use(sellerCancelOrderRoute)
  .use(sellerInquiryRoute)
  .use(sellerReviewRoute)
  .use(sellerReportRoute)
  .use(sellerTrustRoute)
  .use(sellerNotificationsRoute);
