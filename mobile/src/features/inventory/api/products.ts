import { apiFetch } from "../../../api/client";
import type { CreateProductInput, Product, UpdateProductInput, VegetableCatalogItem } from "../types";

export async function fetchVegetableCatalog(search = ""): Promise<VegetableCatalogItem[]> {
  const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
  return apiFetch<VegetableCatalogItem[]>(`/seller/vegetable-catalog${query}`);
}

export interface FetchSellerProductsParams {
  limit?: number;
  cursor?: string;
}

export interface SellerProductsResponse {
  items: Product[];
  nextCursor: string | null;
  summary?: {
    totalProducts: number;
    activeCount: number;
    archivedCount: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
}

export async function fetchSellerProducts(
  params: FetchSellerProductsParams = {},
): Promise<SellerProductsResponse> {
  const query = new URLSearchParams();
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.cursor) query.append("cursor", params.cursor);
  const qs = query.toString();
  const res = await apiFetch<Product[] | SellerProductsResponse>(`/seller/products${qs ? `?${qs}` : ""}`);
  if (Array.isArray(res)) {
    return { items: res, nextCursor: null };
  }
  return res;
}

export async function fetchSellerProduct(productId: string): Promise<Product> {
  return apiFetch<Product>(`/seller/products/${productId}`);
}

export async function createSellerProduct(
  input: CreateProductInput,
): Promise<{ message: string; products: Product }> {
  return apiFetch<{ message: string; products: Product }>("/seller/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateSellerProduct(
  productId: string,
  input: UpdateProductInput,
): Promise<Product> {
  return apiFetch<Product>(`/seller/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function archiveSellerProduct(productId: string): Promise<Product> {
  return apiFetch<Product>(`/seller/products/${productId}/archive`, {
    method: "POST",
  });
}

export async function reactivateSellerProduct(productId: string): Promise<Product> {
  return apiFetch<Product>(`/seller/products/${productId}/reactivate`, {
    method: "POST",
  });
}

export async function adjustProductStock(
  productId: string,
  delta: number,
  reason: string,
): Promise<Product> {
  return apiFetch<Product>(`/seller/products/${productId}/stock-adjustments`, {
    method: "POST",
    body: JSON.stringify({ delta, reason }),
  });
}
