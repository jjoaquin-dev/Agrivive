import { and, asc, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db";
import { vegetable_catalog } from "../../../db/schema";
import type { SellerVegetableCatalogQuery } from "../model/seller.vegetable-catalog";

export async function listSellerVegetableCatalog(query: SellerVegetableCatalogQuery) {
  const search = query.search?.trim();
  const conditions = [
    eq(vegetable_catalog.isActive, true),
    eq(vegetable_catalog.reviewStatus, "approved"),
  ];
  if (query.category) conditions.push(eq(vegetable_catalog.category, query.category));
  if (search) {
    const pattern = `%${search}%`;
    conditions.push(or(
      ilike(vegetable_catalog.filipinoName, pattern),
      ilike(vegetable_catalog.englishName, pattern),
      ilike(vegetable_catalog.searchText, pattern),
    )!);
  }
  return db.select({
    id: vegetable_catalog.id,
    filipinoName: vegetable_catalog.filipinoName,
    englishName: vegetable_catalog.englishName,
    searchAliases: vegetable_catalog.searchAliases,
    category: vegetable_catalog.category,
    scientificName: vegetable_catalog.scientificName,
    sourceUrl: vegetable_catalog.sourceUrl,
  }).from(vegetable_catalog)
    .where(and(...conditions))
    .orderBy(asc(vegetable_catalog.filipinoName))
    .limit(query.limit ?? 50);
}
