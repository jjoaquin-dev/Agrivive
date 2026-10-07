import { t } from "elysia";

export const marketplaceProductRecommendationParams = t.Object({
  id: t.String({ format: "uuid" }),
});

export type MbaRecommendationSource = "none" | "synthetic" | "real";
export type MbaRecommendationStatus = "disabled" | "demo" | "collecting" | "ready" | "unavailable";
