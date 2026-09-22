import { and, desc, eq, lt } from "drizzle-orm";
import { db } from "../../../db";
import { product_stock_adjustments, sellers_product } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import type { SellerStockAdjustmentListQuery } from "../model/seller.stock-adjustment.list";

export async function listSellerStockAdjustments(
  sellerId: string,
  query: SellerStockAdjustmentListQuery = {},
) {
  const limit = query.limit ?? 20;

  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);

    const conditions = [eq(product_stock_adjustments.sellerId, sellerId)];

    if (query.productId) {
      conditions.push(eq(product_stock_adjustments.productId, query.productId));
    }

    if (query.cursor) {
      const cursorDate = new Date(query.cursor);
      if (!isNaN(cursorDate.getTime())) {
        conditions.push(lt(product_stock_adjustments.createdAt, cursorDate));
      }
    }

    const rows = await tx
      .select({
        id: product_stock_adjustments.id,
        productId: product_stock_adjustments.productId,
        productName: sellers_product.productName,
        scalingType: sellers_product.scalingType,
        productType: sellers_product.productType,
        delta: product_stock_adjustments.delta,
        beforeQty: product_stock_adjustments.beforeQty,
        afterQty: product_stock_adjustments.afterQty,
        reason: product_stock_adjustments.reason,
        createdAt: product_stock_adjustments.createdAt,
      })
      .from(product_stock_adjustments)
      .innerJoin(
        sellers_product,
        eq(product_stock_adjustments.productId, sellers_product.id),
      )
      .where(and(...conditions))
      .orderBy(desc(product_stock_adjustments.createdAt))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor =
      hasMore && items.length > 0
        ? items[items.length - 1].createdAt.toISOString()
        : null;

    return {
      items,
      nextCursor,
    };
  });
}
