import { sql } from "drizzle-orm";
import { sellers_profile } from "../../../db/schema";

export function marketplaceDistanceExpression(latitude: number, longitude: number) {
  return sql<number>`6371 * acos(least(1, greatest(-1,
    cos(radians(${latitude})) * cos(radians(${sellers_profile.latitude})) *
    cos(radians(${sellers_profile.longitude}) - radians(${longitude})) +
    sin(radians(${latitude})) * sin(radians(${sellers_profile.latitude}))
  )))`;
}
