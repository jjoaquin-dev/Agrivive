"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { LandingHeader } from "@/src/features/home/components/LandingHeader";
import { PageContainer } from "@/src/components/PageContainer";
import { MarketplaceFooter } from "@/src/features/marketplace/components/MarketplaceFooter";
import {
  getMarketplaceOverview,
  type MarketplaceOverviewRange,
  type MarketplaceOverviewResponse,
} from "@/src/features/marketplace/api/overview";
import { MarketplaceOverviewHeaderComponent } from "@/src/features/marketplace/components/MarketplaceOverviewHeaderComponent";
import { MarketplaceOverviewKpiComponent } from "@/src/features/marketplace/components/MarketplaceOverviewKpiComponent";
import { MarketplaceTopProduceChartComponent } from "@/src/features/marketplace/components/MarketplaceTopProduceChartComponent";
import { MarketplaceActivityTrendComponent } from "@/src/features/marketplace/components/MarketplaceActivityTrendComponent";
import { MarketplaceCategoryBreakdownComponent } from "@/src/features/marketplace/components/MarketplaceCategoryBreakdownComponent";
import { MarketplaceSellerStallsComponent } from "@/src/features/marketplace/components/MarketplaceSellerStallsComponent";
import { MarketplaceBuyerImpactComponent } from "@/src/features/marketplace/components/MarketplaceBuyerImpactComponent";
import { MarketplaceOverviewPrintComponent } from "@/src/features/marketplace/components/MarketplaceOverviewPrintComponent";

export default function MarketplaceOverviewPage() {
  const [range, setRange] = useState<MarketplaceOverviewRange>("month");
  const [data, setData] = useState<MarketplaceOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getMarketplaceOverview(range, controller.signal)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setError(err?.message || "Failed to load marketplace overview.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [range]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="print:hidden">
        <LandingHeader />
      </div>

      <main className="min-h-screen bg-[#F8F6F1] py-8 text-neutral-900 lg:py-12 print:bg-white print:p-0">
        <PageContainer>
          {loading && !data ? (
            <div className="space-y-6">
              <div className="h-28 animate-pulse rounded-2xl bg-white/70" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/70" />
                ))}
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-80 animate-pulse rounded-2xl bg-white/70" />
                <div className="h-80 animate-pulse rounded-2xl bg-white/70" />
              </div>
            </div>
          ) : error && !data ? (
            <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xs">
              <AlertCircle className="mx-auto size-8 text-red-600" />
              <p className="mt-2 text-sm font-semibold text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => setRange(range)}
                className="mt-4 rounded-xl bg-[#457D00] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#386600]"
              >
                Retry
              </button>
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Screen Interactive View */}
              <div className="space-y-8 print:hidden">
                <MarketplaceOverviewHeaderComponent
                  range={range}
                  onRangeChange={setRange}
                  generatedAt={data.generatedAt}
                  isSampleData={data.isSampleData}
                  onPrintReport={handlePrint}
                />

                <MarketplaceOverviewKpiComponent kpis={data.kpis} range={range} />

                <div className="grid gap-6 lg:grid-cols-12 items-start">
                  <div className="lg:col-span-7">
                    <MarketplaceTopProduceChartComponent
                      items={data.topProduce}
                      range={range}
                    />
                  </div>
                  <div className="lg:col-span-5 space-y-6">
                    <MarketplaceActivityTrendComponent
                      trends={data.activityTrends}
                      range={range}
                    />
                    <MarketplaceCategoryBreakdownComponent
                      categories={data.categoryBreakdown}
                    />
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12 items-start">
                  <div className="lg:col-span-7">
                    <MarketplaceSellerStallsComponent stalls={data.sellerStalls} />
                  </div>
                  <div className="lg:col-span-5">
                    <MarketplaceBuyerImpactComponent summary={data.buyerSummary} />
                  </div>
                </div>
              </div>

              {/* Official Printable Report View */}
              <MarketplaceOverviewPrintComponent data={data} />
            </div>
          ) : null}
        </PageContainer>
      </main>

      <div className="print:hidden">
        <MarketplaceFooter />
      </div>
    </>
  );
}
