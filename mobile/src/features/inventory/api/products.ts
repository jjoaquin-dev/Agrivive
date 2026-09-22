import { apiFetch } from "../../../api/client";
import type { CreateProductInput, Product, UpdateProductInput } from "../types";

export async function fetchSellerProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/seller/products");
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
