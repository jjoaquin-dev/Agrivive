"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../CartProvider";

export function CartRoute() {
  const router = useRouter();
  const { setDrawerOpen } = useCart();
  useEffect(() => {
    setDrawerOpen(true);
    router.replace("/marketplace");
  }, [router, setDrawerOpen]);
  return <main className="min-h-screen bg-background" aria-label="Opening cart" />;
}
