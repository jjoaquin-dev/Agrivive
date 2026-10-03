"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Bell, CheckCheck, ChevronRight, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError, isAbortError } from "@/src/lib/api";
import { PageContainer } from "@/src/components/PageContainer";
import { listBuyerNotices, markAllBuyerNoticesRead, markBuyerNoticeRead } from "../api/notices";
import type { BuyerNotice } from "../types";

const noticeTitles: Record<string, string> = {
  seller_cancellation_buyer: "Your reservation was cancelled",
  inquiry_24h_buyer_notice: "Your question is still waiting",
  trust_event_corrected: "A trust record was corrected",
};

const noticeDescriptions: Record<string, string> = {
  seller_cancellation_buyer: "The seller cancelled this reservation and the produce was returned to stock.",
  inquiry_24h_buyer_notice: "The seller has not replied to your order question after 24 hours.",
  trust_event_corrected: "A trust record was corrected after its source information was checked.",
};

function noticeTitle(kind: string) {
  return noticeTitles[kind] ?? "Agrivive account update";
}

function noticeDescription(kind: string) {
  return noticeDescriptions[kind] ?? "Open the related reservation for more information.";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function BuyerNotifications() {
  const [notices, setNotices] = useState<BuyerNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    try {
      setNotices(await listBuyerNotices(signal));
    } catch (reason) {
      if (!isAbortError(reason)) {
        setError(reason instanceof ApiError ? reason.message : "We could not load your notices.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const unreadCount = useMemo(() => notices.filter((notice) => !notice.readAt).length, [notices]);

  async function handleRead(notice: BuyerNotice) {
    if (notice.readAt) return;
    try {
      const updated = await markBuyerNoticeRead(notice.id);
      setNotices((current) => current.map((item) => item.id === updated.id ? { ...item, readAt: updated.readAt } : item));
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "We could not update this notice.");
    }
  }

  async function handleReadAll() {
    if (!unreadCount) return;
    setSaving(true);
    setError("");
    try {
      await markAllBuyerNoticesRead();
      setNotices((current) => current.map((notice) => ({ ...notice, readAt: notice.readAt ?? new Date().toISOString() })));
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "We could not mark notices as read.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-agrivive-background py-8 text-foreground lg:py-12">
      <PageContainer>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-agrivive-primary"><Bell className="size-4" aria-hidden="true" />Your updates</p>
            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Notifications</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Important changes to your reservations and questions appear here.</p>
          </div>
          <Button type="button" variant="outline" onClick={() => void handleReadAll()} disabled={!unreadCount || saving} className="min-h-11 gap-2 rounded-xl">
            <CheckCheck className="size-4" aria-hidden="true" />{saving ? "Saving…" : "Mark all as read"}
          </Button>
        </div>

        {error ? <Alert variant="destructive" className="mt-5"><AlertCircle className="size-4" /><AlertDescription>{notices.length ? `${error} Showing the last notices we loaded.` : error}</AlertDescription><Button type="button" variant="outline" className="mt-3" onClick={() => void load()}>Try again</Button></Alert> : null}

        <div className="mt-6 space-y-3" aria-live="polite">
          {loading ? [1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl border border-border bg-white" />) : null}
          {!loading && !error && notices.length === 0 ? <Card className="rounded-[20px] border-border/80 bg-white shadow-[0_14px_32px_rgba(31,77,58,0.08)]"><CardContent className="flex flex-col items-center gap-2 p-10 text-center"><Bell className="size-8 text-agrivive-sage" /><h2 className="font-heading text-lg font-bold">No notifications yet</h2><p className="max-w-sm text-sm leading-6 text-muted-foreground">We will show reservation and account updates here when something needs your attention.</p></CardContent></Card> : null}
          {!loading ? notices.map((notice) => (
            <Card key={notice.id} className={notice.readAt ? "rounded-[20px] border-border/80 bg-white shadow-[0_10px_24px_rgba(31,77,58,0.05)]" : "rounded-[20px] border-agrivive-primary/30 bg-agrivive-primary/5 shadow-[0_10px_24px_rgba(31,77,58,0.08)]"}>
              <CardHeader className="flex-row items-start justify-between gap-4 pb-2">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-agrivive-primary/10 text-agrivive-primary"><Bell className="size-4" aria-hidden="true" /></span>
                  <div className="min-w-0"><CardTitle className="text-base">{noticeTitle(notice.kind)}</CardTitle><p className="mt-1 text-sm leading-6 text-muted-foreground">{noticeDescription(notice.kind)}</p></div>
                </div>
                {!notice.readAt ? <span className="mt-1 size-2 shrink-0 rounded-full bg-agrivive-terracotta" aria-label="Unread" /> : null}
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-1 pl-16">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="size-3.5" aria-hidden="true" />{formatDate(notice.createdAt)}</p>
                <Link href={`/orders/${notice.orderId}`} onClick={() => void handleRead(notice)} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-agrivive-primary hover:underline">Open reservation<ChevronRight className="size-4" aria-hidden="true" /></Link>
              </CardContent>
            </Card>
          )) : null}
        </div>
      </PageContainer>
    </main>
  );
}
