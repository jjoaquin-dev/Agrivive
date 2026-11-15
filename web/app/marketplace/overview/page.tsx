"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import type { Chart as ChartJS } from "chart.js";
import { LandingHeader } from "@/src/features/home/components/LandingHeader";
import { PageContainer } from "@/src/components/PageContainer";
import { MarketplaceFooter } from "@/src/features/marketplace/components/MarketplaceFooter";
import {
  getMarketplaceOverview,
  EXPLANATION_KEYS,
  getOverviewExplanations,
  type ExplanationKey,
  type MarketplaceOverviewExplanations,
  type MarketplaceOverviewResponse,
} from "@/src/features/marketplace/api/overview";
import { MarketplaceOverviewHeaderComponent } from "@/src/features/marketplace/components/MarketplaceOverviewHeaderComponent";
import { MarketplaceOverviewKpiComponent } from "@/src/features/marketplace/components/MarketplaceOverviewKpiComponent";
import { MarketplaceOverviewPrintComponent } from "@/src/features/marketplace/components/MarketplaceOverviewPrintComponent";
import { OverviewTrendChart } from "@/src/features/marketplace/components/OverviewTrendChart";
import { OverviewProduceChart } from "@/src/features/marketplace/components/OverviewProduceChart";
import { OverviewDemandChart } from "@/src/features/marketplace/components/OverviewDemandChart";
import { OverviewWeekdayChart } from "@/src/features/marketplace/components/OverviewWeekdayChart";
import { OverviewPriceChart } from "@/src/features/marketplace/components/OverviewPriceChart";
import { OverviewCompareChart } from "@/src/features/marketplace/components/OverviewCompareChart";
import { OverviewShareChart } from "@/src/features/marketplace/components/OverviewShareChart";
import type { Explanation } from "@/src/features/marketplace/components/OverviewChartCard";

// Two charts per row; a last chart on its own row fills the full width. `single` puts every chart on its own row.
const Section = ({ title, single, children }: { title: string; single?: boolean; children: React.ReactNode }) => (
  <section className="space-y-4">
    <h2 className="border-b border-neutral-200 pb-2 text-lg font-bold text-neutral-900 sm:text-xl">{title}</h2>
    <div className={`grid items-start gap-6 ${single ? "" : "lg:grid-cols-2 [&>*:last-child:nth-child(odd)]:lg:col-span-2"}`}>{children}</div>
  </section>
);

export default function MarketplaceOverviewPage() {
  const [dates, setDates] = useState<{ from?: string; to?: string }>({});
  const [data, setData] = useState<MarketplaceOverviewResponse | null>(null);
  const [explanations, setExplanations] = useState<MarketplaceOverviewExplanations | null>(null);
  const [explainState, setExplainState] = useState<"loading" | "ready" | "missing">("loading");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<Partial<Record<ExplanationKey, string>>>({});
  const charts = useRef<Partial<Record<ExplanationKey, ChartJS | null>>>({});

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setExplanations(null);
    setExplainState("loading");
    getMarketplaceOverview(dates.from, dates.to, controller.signal)
      .then((res) => { setData(res); setError(null); })
      .catch((err) => { if (err?.name !== "AbortError") setError(err?.message || "Failed to load marketplace overview."); })
      .finally(() => setLoading(false));
    // The explanations take longer (Groq), so the charts show first.
    getOverviewExplanations(dates.from, dates.to, controller.signal)
      .then((res) => { setExplanations(res); setExplainState("ready"); })
      .catch((err) => { if (err?.name !== "AbortError") setExplainState("missing"); });
    return () => controller.abort();
  }, [dates, retryKey]);

  const kinds = (data?.categoryDemand ?? []).map((c) => c.category).sort();
  const register = useCallback((key: ExplanationKey) => (chart: ChartJS | null) => { charts.current[key] = chart; }, []);
  const explain = (key: ExplanationKey): Explanation => explanations
    ? { state: "ready", text: explanations[key], source: explanations.source }
    : { state: explainState === "loading" ? "loading" : "missing" };

  // Charts are drawn on canvases, so each one is copied to a picture before the print dialog opens.
  const savePdf = () => {
    setSaving(true);
    const pictures: Partial<Record<ExplanationKey, string>> = {};
    for (const key of EXPLANATION_KEYS) {
      const picture = charts.current[key]?.toBase64Image("image/png", 1);
      if (picture) pictures[key] = picture;
    }
    setImages(pictures);
    setTimeout(() => { window.print(); setSaving(false); }, 300);
  };

  return (
    <>
      <div className="print:hidden">
        <LandingHeader />
      </div>

      <main className="min-h-screen bg-agrivive-background pb-8 pt-24 text-neutral-900 md:pt-44 lg:pb-12 print:min-h-0 print:bg-white print:p-0">
        <PageContainer>
          {loading && !data ? (
            <div className="space-y-6">
              <div className="h-28 animate-pulse rounded-2xl bg-white/70" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/70" />)}
              </div>
              <div className="h-96 animate-pulse rounded-2xl bg-white/70" />
            </div>
          ) : error && !data ? (
            <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
              <AlertCircle className="mx-auto size-8 text-destructive" />
              <p className="mt-2 text-sm font-semibold text-destructive">{error}</p>
              <button
                type="button"
                onClick={() => { setError(null); setRetryKey((key) => key + 1); }}
                className="mt-4 min-h-11 rounded-xl bg-agrivive-primary px-4 text-xs font-bold text-white shadow-sm transition hover:bg-agrivive-primary/90"
              >
                Retry
              </button>
            </div>
          ) : data ? (
            <div className="space-y-8">
              <div className={`space-y-8 transition-opacity print:hidden ${loading ? "opacity-60" : ""}`}>
                <MarketplaceOverviewHeaderComponent
                  from={data.from}
                  to={data.to}
                  onDatesChange={(from, to) => setDates({ from, to })}
                  generatedAt={data.generatedAt}
                  isSampleData={data.isSampleData}
                  saving={saving}
                  onSavePdf={savePdf}
                />
                <MarketplaceOverviewKpiComponent kpis={data.kpis} />
                {data.kpis.completedPickups === 0 ? (
                  <p className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-800">
                    No orders were picked up from {data.from} to {data.to}, so the charts below are empty.{" "}
                    <button type="button" className="font-bold text-agrivive-primary underline underline-offset-2" onClick={() => { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 364); const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; setDates({ from: iso(start), to: iso(end) }); }}>
                      Show the last 12 months
                    </button>
                  </p>
                ) : null}
                <Section title="What was bought, and at what price">
                  <OverviewProduceChart items={data.topProduce} explanation={explain("produce")} chartRef={register("produce")} />
                  <OverviewPriceChart items={data.topProduce} explanation={explain("price")} chartRef={register("price")} />
                  <OverviewCompareChart items={data.topProduce} explanation={explain("compare")} chartRef={register("compare")} />
                </Section>
                <Section title="Kinds of vegetables: bought and listed">
                  <OverviewShareChart mode="bought" categories={data.categoryDemand} allKinds={kinds} explanation={explain("bought")} chartRef={register("bought")} />
                  <OverviewShareChart mode="listed" categories={data.categoryDemand} allKinds={kinds} explanation={explain("listed")} chartRef={register("listed")} />
                  <OverviewDemandChart categories={data.categoryDemand} explanation={explain("demand")} chartRef={register("demand")} />
                </Section>
                <Section title="When orders were picked up" single>
                  <OverviewTrendChart points={data.activityTrends} bucket={data.bucket} explanation={explain("trend")} chartRef={register("trend")} />
                  <OverviewWeekdayChart days={data.weekdayDemand} explanation={explain("weekday")} chartRef={register("weekday")} />
                </Section>
              </div>

              <MarketplaceOverviewPrintComponent data={data} explanations={explanations} images={images} />
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
