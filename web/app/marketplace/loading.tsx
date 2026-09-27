import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { PageContainer } from "@/src/components/PageContainer";

export default function MarketplaceLoading() {
  return (
    <>
      <BuyerSiteHeader />
      <main className="min-h-screen bg-background py-8">
        <PageContainer>
          <div className="h-36 animate-pulse rounded-2xl bg-card" />
          <div className="mt-6 h-14 animate-pulse rounded-full bg-card" />
          <div className="mt-4 h-36 animate-pulse rounded-2xl bg-card" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-96 animate-pulse rounded-xl bg-card" />)}
          </div>
        </PageContainer>
      </main>
    </>
  );
}
