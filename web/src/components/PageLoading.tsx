import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";

/** Placeholder shown while a page loads: the site header, a title block and a few card blocks. */
export function PageLoading({ cards = 3, label = "Loading" }: { cards?: number; label?: string }) {
  return (
    <>
      <BuyerSiteHeader />
      <main className="min-h-screen bg-background px-4 py-8" aria-busy="true" aria-label={label}>
        <div className="mx-auto max-w-[1000px]">
          <div className="h-28 animate-pulse rounded-xl bg-card" />
          <div className="mt-7 space-y-4">
            {Array.from({ length: cards }, (_, item) => <div key={item} className="h-40 animate-pulse rounded-xl bg-card" />)}
          </div>
        </div>
      </main>
    </>
  );
}
