"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  BarChart2,
  CheckCircle2,
  Clock,
  FileText,
  ShoppingBag,
  Users,
} from "lucide-react";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { PageContainer } from "@/src/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getStakeholderSummary, type StakeholderSummary } from "@/src/features/stakeholder/api/summary";

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

  return (
    <>
      <BuyerSiteHeader />
      <main className="min-h-[calc(100vh-73px)] bg-agrivive-background py-8 text-foreground lg:py-12">
        <PageContainer>
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Marketplace Platform Overview
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Public high-level aggregate statistics across Agrivive marketplace operations and community activity.
            </p>
            {data?.generatedAt ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Last updated: {new Date(data.generatedAt).toLocaleString()}
              </p>
            ) : null}
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl bg-card" />
              ))}
            </div>
          ) : error || !data ? (
            <Card className="p-8 text-center">
              <AlertCircle className="mx-auto size-8 text-destructive" />
              <p className="mt-2 text-sm font-medium text-destructive">{error || "Could not load summary."}</p>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Aggregate Highlights */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Community Members</CardTitle>
                    <Users className="size-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold font-heading">{data.users.sellers + data.users.buyers}</div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Sellers: <strong>{data.users.sellers}</strong></span>
                      <span>Buyers: <strong>{data.users.buyers}</strong></span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Surplus Listings</CardTitle>
                    <ShoppingBag className="size-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold font-heading text-primary">{data.listings.active}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Out of {data.listings.total} total catalog items
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completed Reservations</CardTitle>
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold font-heading text-emerald-600">
                      {data.orders.completed ?? 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Successfully picked up and verified
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports Filed</CardTitle>
                    <FileText className="size-4 text-amber-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold font-heading">{data.reports.total}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Order issues recorded for quality assurance
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Order Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart2 className="size-5 text-primary" />
                    Reservation Volume by Status
                  </CardTitle>
                  <CardDescription>
                    Snapshot of buyer order states across the marketplace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="size-4" /> Completed
                      </div>
                      <p className="mt-2 text-2xl font-bold font-heading">{data.orders.completed ?? 0}</p>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
                        <Clock className="size-4" /> Pending Pickup
                      </div>
                      <p className="mt-2 text-2xl font-bold font-heading">{data.orders.pending ?? 0}</p>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <AlertCircle className="size-4" /> Cancelled
                      </div>
                      <p className="mt-2 text-2xl font-bold font-heading">{data.orders.cancelled ?? 0}</p>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                        <Clock className="size-4" /> Expired (24h)
                      </div>
                      <p className="mt-2 text-2xl font-bold font-heading">{data.orders.expired ?? 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </PageContainer>
      </main>
    </>
  );
}
