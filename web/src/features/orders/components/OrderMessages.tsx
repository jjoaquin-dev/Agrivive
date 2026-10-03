"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError, isAbortError } from "@/src/lib/api";
import { createBuyerOrderInquiry, listBuyerOrderInquiries, type BuyerOrderInquiry } from "../api/inquiries";

export function OrderMessages({ orderId, refreshKey = 0 }: { orderId: string; refreshKey?: number }) {
  const [items, setItems] = useState<BuyerOrderInquiry[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setItems(await listBuyerOrderInquiries(orderId, signal));
      setError("");
    } catch (reason) {
      if (!isAbortError(reason)) setError(reason instanceof ApiError ? reason.message : "We could not load order messages.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    void load(controller.signal);
    return () => controller.abort();
  }, [load, refreshKey]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || trimmed.length > 1000 || sending) return;
    setSending(true);
    setError("");
    try {
      const created = await createBuyerOrderInquiry(orderId, trimmed);
      setItems((current) => [...current, created]);
      setQuestion("");
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : "We could not send your question.");
    } finally {
      setSending(false);
    }
  }

  const openInquiry = items.some((item) => !item.reply);

  return (
    <Card className="overflow-hidden rounded-[20px] border-border/80 bg-white shadow-[0_10px_24px_rgba(31,77,58,0.05)]">
      <CardHeader className="border-b border-border/60 pb-3"><CardTitle className="flex items-center gap-2 text-base font-bold"><MessageCircle className="size-4 text-agrivive-primary" aria-hidden="true" />Messages with the seller</CardTitle></CardHeader>
      <CardContent className="space-y-4 pt-5">
        {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
        {loading ? <div className="h-20 animate-pulse rounded-xl bg-muted" /> : items.length === 0 ? <p className="text-sm leading-6 text-muted-foreground">Ask the seller about pickup details or your reservation.</p> : <div className="space-y-3">{items.map((item) => <div key={item.id} className="rounded-xl border border-border/70 bg-agrivive-background/50 p-4"><p className="text-sm font-semibold">You asked</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.question}</p>{item.reply ? <><p className="mt-3 text-sm font-semibold text-agrivive-primary">Seller replied</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.reply}</p><p className="mt-2 text-xs text-muted-foreground">Replied {new Date(item.repliedAt ?? item.createdAt).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}</p></> : <p className="mt-3 text-xs font-semibold text-amber-700">Waiting for a reply</p>}</div>)}</div>}
        <form onSubmit={handleSubmit} className="space-y-3 border-t border-border/60 pt-4">
          <label htmlFor="buyer-order-question" className="text-sm font-semibold">Ask one question</label>
          <textarea id="buyer-order-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={1000} rows={3} disabled={openInquiry || sending} placeholder={openInquiry ? "Wait for the seller's reply before asking another question." : "Write a clear question about this reservation."} className="w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60" />
          <div className="flex flex-wrap items-center justify-between gap-2"><span className={`text-xs ${question.length > 1000 ? "text-destructive" : "text-muted-foreground"}`}>{question.length}/1000</span><Button type="submit" disabled={openInquiry || sending || !question.trim() || question.trim().length > 1000} className="min-h-11 gap-2"><Send className="size-4" aria-hidden="true" />{sending ? "Sending…" : "Send question"}</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}
