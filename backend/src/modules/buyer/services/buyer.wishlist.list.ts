import { and, desc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { buyer_saved_products, sellers_product, sellers_profile, user } from "../../../db/schema";
import { getProductImageDisplayUrl } from "../../../utils/product-image";
import { marketplaceSellerVisibility } from "../../marketplace/services/marketplace.visibility";

export async function listBuyerWishlist(buyerId: string) {
  const rows = await db
    .select({
      id: sellers_product.id,
      productName: sellers_product.productName,
      imagUrl: sellers_product.imagUrl,
      productPrice: sellers_product.productPrice,
      basePrice: sellers_product.basePrice,
      productQty: sellers_product.productQty,
      scalingType: sellers_product.scalingType,
      productType: sellers_product.productType,
      condition: sellers_product.condition,
      publishedAt: sellers_product.publishedAt,
      sellerId: sellers_profile.userId,
      sellerName: user.name,
      shopName: sellers_profile.shopName,
      sellerType: sellers_profile.sellerType,
      detailAddress: sellers_profile.detailAddress,
      pickupInstructions: sellers_profile.pickupInstructions,
      latitude: sellers_profile.latitude,
      longitude: sellers_profile.longitude,
    })
    .from(buyer_saved_products)
    .innerJoin(sellers_product, eq(sellers_product.id, buyer_saved_products.productId))
    .innerJoin(sellers_profile, eq(sellers_profile.userId, sellers_product.userId))
    .innerJoin(user, eq(user.id, sellers_product.userId))
    .where(
      and(
        eq(buyer_saved_products.buyerId, buyerId),
        eq(sellers_product.isActive, true),
        eq(user.isActive, true),
        marketplaceSellerVisibility(),
      ),
    )
    .orderBy(desc(buyer_saved_products.createdAt));

  const products = await Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      productName: row.productName,
      imageUrl: await getProductImageDisplayUrl(row.imagUrl, row.sellerId),
      productPrice: row.productPrice,
      basePrice: row.basePrice,
      productQty: row.productQty,
      scalingType: row.scalingType,
      productType: row.productType,
      condition: row.condition,
      availability: Number(row.productQty ?? 0) > 0 ? ("available" as const) : ("sold_out" as const),
      averageRating: null,
      reviewCount: 0,
      seller: {
        id: row.sellerId,
        name: row.sellerName,
        shopName: row.shopName,
        sellerType: row.sellerType,
        detailAddress: row.detailAddress,
        pickupInstructions: row.pickupInstructions,
        latitude: row.latitude,
        longitude: row.longitude,
        distanceKm: null,
      },
    })),
  );

  return {
    productIds: rows.map((row) => row.id),
    products,
  };
}
