"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, FileText, Lock, ShieldCheck, Users } from "lucide-react";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { PageContainer } from "@/src/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError } from "@/src/lib/api";
import { getAdminPerformance, type AdminPerformance } from "@/src/features/admin/api/performance";
import { TrustMonitoringCard } from "@/src/features/admin/components/TrustMonitoringCard";

export default function AdminPerformancePage() {
  const [data, setData] = useState<AdminPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getAdminPerformance(controller.signal)
      .then((res) => {
        setData(res);
        setAccessDenied(false);
      })
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          setAccessDenied(true);
        } else {
          setError(err?.message || "Failed to load admin performance metrics.");
        }
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
              Platform Performance & Trust Monitoring
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Read-only aggregate metrics and system trust signals. Monitoring signals do not impose penalties.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-card" />
              ))}
            </div>
          ) : accessDenied ? (
            <Card className="mx-auto max-w-md p-8 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                <Lock className="size-6" />
              </div>
              <h2 className="mt-4 font-heading text-lg font-bold">Admin Access Required</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You must be signed in with an administrator account to view performance metrics.
              </p>
              <Link
                href="/login?next=/admin/performance"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Sign in as Admin
              </Link>
            </Card>
          ) : error || !data ? (
            <Card className="p-8 text-center">
              <AlertTriangle className="mx-auto size-8 text-destructive" />
              <p className="mt-2 text-sm font-medium text-destructive">{error || "Could not load data."}</p>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Overview Metrics Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                    <Users className="size-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-heading">{data.users.sellers + data.users.buyers}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {data.users.sellers} sellers · {data.users.buyers} buyers
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Listings</CardTitle>
                    <Activity className="size-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-heading">{data.listings.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {data.listings.active} active and marketable
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                    <FileText className="size-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-heading">
                      {Object.values(data.orders).reduce((acc, c) => acc + c, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {data.orders.completed ?? 0} completed · {data.orders.pending ?? 0} pending
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Trust Signals</CardTitle>
                    <ShieldCheck className="size-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-heading">{data.trust.verifiedEvents}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {data.trust.reportFlags} report flags · {data.trust.evidenceFiles} evidence files
                    </p>
                  </CardContent>
                </Card>
              </div>

              <TrustMonitoringCard monitoring={data.trustMonitoring} />
            </div>
          )}
        </PageContainer>
      </main>
    </>
  );
}
