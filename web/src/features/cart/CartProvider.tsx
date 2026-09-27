"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { MarketplaceProduct } from "@/src/features/marketplace/types";
import type { CartItem } from "./types";

const CART_STORAGE_KEY = "agrivive:buyer-cart:v1";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  isReady: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addItem: (product: MarketplaceProduct, quantity: number) => void;
  refreshItem: (product: MarketplaceProduct) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  const seller = item.seller;
  return typeof item.id === "string"
    && typeof item.productName === "string"
    && typeof item.quantity === "number"
    && Number.isFinite(item.quantity)
    && item.quantity > 0
    && (typeof item.productQty === "string" || typeof item.productQty === "number")
    && !!seller
    && typeof seller.id === "string"
    && typeof seller.shopName === "string"
    && typeof seller.detailAddress === "string";
}

function readCart() {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isReady]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.length,
    isReady,
    drawerOpen,
    setDrawerOpen,
    addItem(product, quantity) {
      setItems((current) => {
        const maxQuantity = Number(product.productQty);
        const existing = current.find((item) => item.id === product.id);
        const nextQuantity = (existing?.quantity ?? 0) + quantity;
        const cappedQuantity = Number.isFinite(maxQuantity) ? Math.min(nextQuantity, maxQuantity) : nextQuantity;
        if (existing) {
          return current.map((item) => item.id === product.id ? { ...product, quantity: cappedQuantity } : item);
        }
        return [...current, { ...product, quantity: cappedQuantity }];
      });
    },
    refreshItem(product) {
      setItems((current) => current.flatMap((item) => {
        if (item.id !== product.id) return [item];
        const maxQuantity = Number(product.productQty);
        const nextQuantity = Number.isFinite(maxQuantity) ? Math.min(item.quantity, maxQuantity) : item.quantity;
        return nextQuantity > 0 ? [{ ...product, quantity: nextQuantity }] : [];
      }));
    },
    updateQuantity(productId, quantity) {
      setItems((current) => current.flatMap((item) => {
        if (item.id !== productId) return [item];
        if (!Number.isFinite(quantity) || quantity <= 0) return [];
        const maxQuantity = Number(item.productQty);
        return [{ ...item, quantity: Number.isFinite(maxQuantity) ? Math.min(quantity, maxQuantity) : quantity }];
      }));
    },
    removeItem(productId) {
      setItems((current) => current.filter((item) => item.id !== productId));
    },
    clear() {
      setItems([]);
    },
  }), [items, isReady, drawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
