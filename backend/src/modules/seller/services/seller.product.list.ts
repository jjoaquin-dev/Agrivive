import { and, desc, eq, lt, or, sql } from "drizzle-orm";
import { db } from "../../../db";
import { sellers_product } from "../../../db/schema";
import { requireVerifiedSeller } from "../../../utils/seller-access";
import { getProductImageDisplayUrl } from "../../../utils/product-image";
import { applySellerProductPriceReduction } from "./seller.product.price-reduction";

export async function listSellerProducts(sellerId: string, limit = 20, cursor?: string) {
  return db.transaction(async (tx) => {
    await requireVerifiedSeller(tx, sellerId);

    let before;
    if (cursor) {
      const [anchor] = await tx
        .select({ id: sellers_product.id, createdAt: sellers_product.createdAt })
        .from(sellers_product)
        .where(and(eq(sellers_product.id, cursor), eq(sellers_product.userId, sellerId)))
        .limit(1);
      if (anchor) {
        before = or(
          lt(sellers_product.createdAt, anchor.createdAt),
          and(eq(sellers_product.createdAt, anchor.createdAt), lt(sellers_product.id, anchor.id)),
        );
      }
    }

    const rows = await tx
      .select()
      .from(sellers_product)
      .where(and(eq(sellers_product.userId, sellerId), before))
      .orderBy(desc(sellers_product.createdAt), desc(sellers_product.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    const updatedProducts = [];
    for (const product of page) {
      updatedProducts.push(await applySellerProductPriceReduction(tx, product.id));
    }

    const [stats] = await tx
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where is_active = true)::int`,
        archived: sql<number>`count(*) filter (where is_active = false)::int`,
        lowStock: sql<number>`count(*) filter (where is_active = true and product_qty <= coalesce(low_stock_threshold, 0))::int`,
        outOfStock: sql<number>`count(*) filter (where is_active = true and product_qty <= 0)::int`,
      })
      .from(sellers_product)
      .where(eq(sellers_product.userId, sellerId));

    const items = await Promise.all(
      updatedProducts
        .filter((product): product is NonNullable<typeof product> => product !== null)
        .map(async (product) => ({
          ...product,
          displayImageUrl: await getProductImageDisplayUrl(product.imagUrl, sellerId),
        })),
    );

    return {
      items,
      nextCursor: hasMore && page.length > 0 ? page[page.length - 1].id : null,
      summary: {
        totalProducts: Number(stats?.total ?? 0),
        activeCount: Number(stats?.active ?? 0),
        archivedCount: Number(stats?.archived ?? 0),
        lowStockCount: Number(stats?.lowStock ?? 0),
        outOfStockCount: Number(stats?.outOfStock ?? 0),
      },
    };
  });
}
