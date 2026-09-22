import { t } from "elysia";
import { sellerProductId } from "./seller.product";

export const sellerProductAdjustStockParams = sellerProductId;
export const sellerProductAdjustStock = t.Object({
  delta: t.Number({ minimum: -99_999_999, maximum: 99_999_999 }),
  reason: t.String({ minLength: 1, maxLength: 500, pattern: "\\S" }),
}, { additionalProperties: false });
