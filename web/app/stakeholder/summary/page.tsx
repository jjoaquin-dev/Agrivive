"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { PageContainer } from "@/src/components/PageContainer";
import { Card } from "@/components/ui/card";
import { getStakeholderSummary, type StakeholderSummary } from "@/src/features/stakeholder/api/summary";
import { StakeholderHeaderComponent } from "./components/StakeholderHeaderComponent";
import { StakeholderKpiGridComponent } from "./components/StakeholderKpiGridComponent";
import { StakeholderCropCategoryComponent } from "./components/StakeholderCropCategoryComponent";
import { StakeholderOrderStatusComponent } from "./components/StakeholderOrderStatusComponent";
import { StakeholderPrintLayoutComponent } from "./components/StakeholderPrintLayoutComponent";

export default function StakeholderSummaryPage() {
  const [data, setData] = useState<StakeholderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getStakeholderSummary(controller.signal)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load marketplace summary.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <>
      <div className="print:hidden">
        <BuyerSiteHeader />
      </div>

      <main className="min-h-[calc(100vh-73px)] bg-agrivive-background py-8 text-foreground lg:py-12 print:bg-white print:p-0">
        <PageContainer>
          {loading ? (
            <div className="space-y-6">
              <div className="h-20 animate-pulse rounded-2xl bg-card" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 animate-pulse rounded-2xl bg-card" />
                ))}
              </div>
            </div>
          ) : error || !data ? (
            <Card className="p-8 text-center">
              <AlertCircle className="mx-auto size-8 text-destructive" />
              <p className="mt-2 text-sm font-medium text-destructive">{error || "Could not load summary."}</p>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Screen View */}
              <div className="space-y-8 print:hidden">
                <StakeholderHeaderComponent
                  generatedAt={data.generatedAt}
                  onDownloadPdf={handleDownloadPdf}
                />
                <StakeholderKpiGridComponent data={data} />
                <StakeholderCropCategoryComponent categories={data.cropCategories} />
                <StakeholderOrderStatusComponent
                  orders={data.orders}
                  totalReports={data.reports.total}
                />
              </div>

              {/* Official Printable PDF View */}
              <StakeholderPrintLayoutComponent data={data} />
            </div>
          )}
        </PageContainer>
      </main>
    </>
  );
}
