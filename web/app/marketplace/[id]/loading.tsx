import { Skeleton } from "@/components/ui/skeleton";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { PageContainer } from "@/src/components/PageContainer";

export default function MarketplaceProductLoading() {
  return (
    <>
      <BuyerSiteHeader />
      <main className="min-h-screen bg-background py-8">
        <PageContainer><Skeleton className="h-[620px] w-full rounded-2xl" /></PageContainer>
      </main>
    </>
  );
}
