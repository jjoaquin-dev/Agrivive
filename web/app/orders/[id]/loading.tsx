import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";

export default function OrderDetailLoading() {
  return <><BuyerSiteHeader /><main className="min-h-screen bg-background px-4 py-8"><div className="mx-auto max-w-[900px]"><div className="h-8 w-40 animate-pulse rounded bg-card" /><div className="mt-6 h-[500px] animate-pulse rounded-xl bg-card" /></div></main></>;
}
