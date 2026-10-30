"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { authClient } from "@/src/lib/auth-client";
import { isAbortError } from "@/src/lib/api";
import { listBuyerNotices, markAllBuyerNoticesRead, markBuyerNoticeRead } from "../api/notices";
import type { BuyerNotice } from "../types";

export type NoticeFilterTab = "all" | "reservations" | "produce" | "updates";

const isProduceNotice = (kind: string) =>
  kind === "seller_new_listing" || kind === "seller_price_drop" || kind === "seller_restock";

export function useBuyerNotifications() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [notices, setNotices] = useState<BuyerNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<NoticeFilterTab>("all");
  const currentRecipient = useRef(session?.user?.id);
  currentRecipient.current = session?.user?.id;

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!currentRecipient.current) {
      setNotices([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await listBuyerNotices(signal);
      if (!signal?.aborted) setNotices(result);
    } catch (err) {
      if (!isAbortError(err)) setNotices([]);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionPending) return;
    if (!session?.user) {
      setNotices([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load, session?.user?.id, sessionPending]);

  const unreadCount = useMemo(
    () => notices.filter((n) => !n.readAt).length,
    [notices]
  );

  const counts = useMemo(() => {
    return {
      all: notices.length,
      reservations: notices.filter((n) => n.kind.includes("cancellation") || (Boolean(n.orderId) && !n.kind.includes("trust"))).length,
      produce: notices.filter((n) => isProduceNotice(n.kind)).length,
      updates: notices.filter((n) => n.kind.includes("trust") || (!n.orderId && !isProduceNotice(n.kind))).length,
    };
  }, [notices]);

  const filteredNotices = useMemo(() => {
    if (activeTab === "reservations") {
      return notices.filter((n) => n.kind.includes("cancellation") || (Boolean(n.orderId) && !n.kind.includes("trust")));
    }
    if (activeTab === "produce") {
      return notices.filter((n) => isProduceNotice(n.kind));
    }
    if (activeTab === "updates") {
      return notices.filter((n) => n.kind.includes("trust") || (!n.orderId && !isProduceNotice(n.kind)));
    }
    return notices;
  }, [activeTab, notices]);

  const markAsRead = useCallback(async (notice: BuyerNotice) => {
    if (notice.readAt) return;
    setNotices((curr) =>
      curr.map((item) => (item.id === notice.id ? { ...item, readAt: new Date().toISOString() } : item))
    );
    try {
      await markBuyerNoticeRead(notice.id);
    } catch {
      // optimistic state kept for seamless UX
    }
  }, []);

  const markAllRead = useCallback(async () => {
    if (!unreadCount) return;
    setSaving(true);
    setNotices((curr) =>
      curr.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() }))
    );
    try {
      await markAllBuyerNoticesRead();
    } finally {
      setSaving(false);
    }
  }, [unreadCount]);

  return {
    notices: filteredNotices,
    allNoticesCount: notices.length,
    unreadCount,
    counts,
    loading,
    saving,
    activeTab,
    setActiveTab,
    markAsRead,
    markAllRead,
    refresh: load,
  };
}
