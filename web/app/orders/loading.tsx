import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";

export default function OrdersLoading() {
  return <><BuyerSiteHeader /><main className="min-h-screen bg-background px-4 py-8"><div className="mx-auto max-w-[1000px]"><div className="h-28 animate-pulse rounded-xl bg-card" /><div className="mt-7 space-y-4">{[1, 2, 3].map((item) => <div key={item} className="h-40 animate-pulse rounded-xl bg-card" />)}</div></div></main></>;
}
