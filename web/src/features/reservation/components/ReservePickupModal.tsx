"use client";

import { useEscapeKey } from "../../../hooks/useEscapeKey";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CalendarClock, Clock, Info, Loader2, MapPin, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiError, isAbortError } from "@/src/lib/api";
import { ProductImage } from "@/src/features/marketplace/components/ProductImage";
import { formatPeso } from "@/src/lib/money";
import { PICKUP_DISCLAIMER, getReservationTerms, type ReservationTerms } from "../api/reservation";
import { formatPickupBy, formatStallHours } from "../lib/formatTerms";

export type ReserveItem = { id: string; name: string; imageUrl?: string | null; productType: string; quantity: number | string; unit: string; price: number };
export type ReserveSeller = { sellerId: string; shopName: string; address?: string; items: ReserveItem[]; amount?: number };

type Terms = ReservationTerms | { error: string };

/** One confirmation: the stall's hours, the time to pick up by, and what a missed pickup costs. The buyer no longer picks a time. */
export function ReservePickupModal({ open, sellers, total, loading, error, onClose, onConfirm }: {
  open: boolean; sellers: ReserveSeller[]; total: string; loading: boolean; error: string; onClose: () => void;
  onConfirm: (sellerIds: string[]) => void | Promise<void>;
}) {
  const [terms, setTerms] = useState<Record<string, Terms>>({});
  const [left, setLeft] = useState<string[]>([]);
  const key = sellers.map((seller) => seller.sellerId).join(",");

  useEffect(() => {
    if (!open) return;
    setLeft([]);
    setTerms({});
    const controller = new AbortController();
    sellers.forEach((seller) => {
      getReservationTerms(seller.sellerId, controller.signal)
        .then((value) => setTerms((current) => ({ ...current, [seller.sellerId]: value })))
        .catch((reason: unknown) => {
          if (isAbortError(reason)) return;
          const message = reason instanceof ApiError ? reason.message : "We could not check this stall's hours.";
          setTerms((current) => ({ ...current, [seller.sellerId]: { error: message } }));
        });
    });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, key]);
  if (!open || typeof document === "undefined") return null;

  const active = sellers.filter((seller) => !left.includes(seller.sellerId));
  const ready = active.length > 0 && active.every((seller) => terms[seller.sellerId] && !("error" in terms[seller.sellerId]!));
  const shownTotal = sellers.every((seller) => seller.amount !== undefined)
    ? formatPeso(active.reduce((sum, seller) => sum + (seller.amount ?? 0), 0)) : total;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Reserve for pickup">
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[#E5E2DA] p-5">
          <div>
            <h2 className="font-heading text-lg font-bold">Reserve for pickup</h2>
            <p className="text-xs text-neutral-600">Check the pickup time, then reserve.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-11 items-center justify-center rounded-full hover:bg-neutral-100"><X className="size-5" /></button>
        </div>
        <div data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto bg-[#F8F6F1] p-5">
          <div className="space-y-2" role="note" aria-label="Before you reserve">
            <p className="flex items-start gap-2.5 rounded-xl border border-[#F0C9B3] bg-[#FFF0E8] px-3.5 py-3 text-sm leading-snug text-[#7A2E0E]">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span><strong className="font-bold">Reminder: </strong>If you miss this pickup, points are added to your account. Too many points can pause your reservations.</span>
            </p>
            <p className="flex items-start gap-2.5 rounded-xl border border-[#F0DFA8] bg-[#FFF8E6] px-3.5 py-3 text-sm leading-snug text-[#6B4E00]">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span><strong className="font-bold">Notice: </strong>{PICKUP_DISCLAIMER}</span>
            </p>
          </div>
          {sellers.map((seller) => {
            const info = terms[seller.sellerId];
            if (left.includes(seller.sellerId)) return (
              <section key={seller.sellerId} className="space-y-2 rounded-xl border border-dashed border-[#E5E2DA] p-4">
                <h3 className="text-sm font-bold">{seller.shopName}</h3>
                <p className="text-xs text-neutral-600">Left out. These items stay in your cart.</p>
                <button type="button" onClick={() => setLeft((current) => current.filter((id) => id !== seller.sellerId))} className="min-h-11 text-xs font-semibold text-[#244218] underline">Add this stall back</button>
              </section>
            );
            return (
              <section key={seller.sellerId} className="space-y-3 rounded-xl border border-[#E5E2DA] bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base font-bold">{seller.shopName}</h3>
                    {seller.address ? <p className="mt-0.5 flex items-start gap-1.5 text-xs text-neutral-600"><MapPin className="mt-0.5 size-3.5 shrink-0" />{seller.address}</p> : null}
                  </div>
                  {sellers.length > 1 ? <button type="button" onClick={() => setLeft((current) => [...current, seller.sellerId])} className="min-h-11 shrink-0 text-xs font-semibold text-neutral-600 underline">Leave this stall out</button> : null}
                </div>
                <ul className="space-y-2">
                  {seller.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 rounded-xl border border-[#E5E2DA] p-2">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#F8F6F1]">
                        <ProductImage src={item.imageUrl ?? null} alt={item.name} category={item.productType} className="!object-cover size-full" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#14231A]">{item.name}</p>
                        <p className="text-xs text-neutral-500">{item.quantity} {item.unit}</p>
                      </div>
                      <p className="text-sm font-bold">{formatPeso(item.price * Number(item.quantity))}</p>
                    </li>
                  ))}
                </ul>
                {!info ? <p className="flex items-center gap-2 text-xs text-neutral-500"><Loader2 className="size-4 animate-spin" />Checking the stall's hours…</p>
                  : "error" in info ? <Alert variant="destructive"><AlertDescription>{info.error}</AlertDescription></Alert>
                  : (
                    <div className="space-y-2 border-t border-[#E5E2DA] pt-3">
                      <p className="flex items-center gap-2 text-xs text-neutral-600"><Clock className="size-4 shrink-0" />{formatStallHours(info)}</p>
                      <div className="rounded-xl border border-[#457D00]/30 bg-[#F0F7EB] px-3.5 py-3 text-[#244218]">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide"><CalendarClock className="size-4 shrink-0" />Pick it up on or before</p>
                        <p className="mt-1 pl-6 text-base font-bold">{formatPickupBy(info.pickupBy)}</p>
                        <p className="mt-0.5 pl-6 text-xs leading-snug">
                          {info.is24Hours ? "After that time your QR stops working."
                            : `That is ${info.closingBufferMinutes} minutes before the stall closes.${info.qrUntil && !Number.isNaN(Date.parse(info.qrUntil)) ? ` Your QR still works until ${formatPickupBy(info.qrUntil)}, then it stops.` : ""}`}
                        </p>
                      </div>
                    </div>
                  )}
              </section>
            );
          })}
          {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-[#E5E2DA] bg-white px-5 pt-4">
          <span className="text-sm font-semibold text-neutral-600">Total to pay at pickup</span>
          <span className="font-heading text-xl font-bold text-[#14231A]">{shownTotal}</span>
        </div>
        <div className="flex gap-3 bg-white p-5 pt-3">
          <button type="button" onClick={onClose} disabled={loading} className="min-h-12 flex-1 rounded-xl border border-[#E5E2DA] bg-white text-sm font-semibold hover:bg-neutral-50 disabled:opacity-60">Cancel</button>
          <button type="button" disabled={!ready || loading} onClick={() => void onConfirm(active.map((seller) => seller.sellerId))}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#457D00] text-sm font-semibold text-white disabled:opacity-50">
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}Reserve</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
