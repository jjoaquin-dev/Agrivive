/** "Nena Cruz" becomes "Nena C." so reviews do not show a buyer's full name. */
export function formatReviewBuyerName(name: string | null | undefined): string {
  if (!name) return "Verified buyer";
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return "Verified buyer";
  return `${parts[0]}${parts[1]?.[0] ? ` ${parts[1][0]}.` : ""}`;
}

/** A buyer can change their review for this many days after posting it (Shopee uses about 15). */
export const reviewEditDays = 15;

export function reviewEditDeadline(createdAt: Date): Date {
  return new Date(createdAt.getTime() + reviewEditDays * 86_400_000);
}

export function isReviewEditable(createdAt: Date, now: Date = new Date()): boolean {
  return now.getTime() <= reviewEditDeadline(createdAt).getTime();
}

type ReviewRow = {
  id: string;
  orderId: string;
  rating: number;
  productRating: number | null;
  review: string | null;
  sellerResponse: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

/** The one answer shape for an order review. `rating` stays as the service stars so existing screens keep working. */
export function shapeOrderReview(row: ReviewRow, photoUrl: string | null) {
  return {
    id: row.id,
    orderId: row.orderId,
    serviceRating: row.rating,
    rating: row.rating,
    productRating: row.productRating,
    review: row.review,
    photoUrl,
    sellerResponse: row.sellerResponse,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? null,
    editableUntil: reviewEditDeadline(row.createdAt).toISOString(),
  };
}
