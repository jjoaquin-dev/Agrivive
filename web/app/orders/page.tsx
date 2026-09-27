import { Suspense } from "react";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { BuyerOrders } from "@/src/features/orders/components/BuyerOrders";

export default function OrdersPage() {
  return <><BuyerSiteHeader /><Suspense fallback={<main className="min-h-[calc(100vh-73px)] bg-agrivive-background py-10" />}><BuyerOrders /></Suspense></>;
}
