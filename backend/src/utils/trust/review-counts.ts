import { isNull } from "drizzle-orm";
import { order_reviews } from "../../db/schema";

/** A rating hit by the review-bomb check is kept on file but left out of every average, star count and trust number. */
export const reviewCounts = isNull(order_reviews.ignoredAt);
