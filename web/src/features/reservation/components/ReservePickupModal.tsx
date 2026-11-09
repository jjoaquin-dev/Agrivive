"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarClock, Loader2, MapPin, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PICKUP_DISCLAIMER, type PickupChoice } from "../api/reservation";
import { ProductImage } from "@/src/features/marketplace/components/ProductImage";
import { formatPeso } from "@/src/lib/money";
import { PickupPicker, formatPickupClock, type PickupRange } from "./PickupPicker";

export type ReserveItem = { id: string; name: string; imageUrl?: string | null; productType: string; quantity: number | string; unit: string; price: number };
export type ReserveSeller = { sellerId: string; shopName: string; address?: string; items: ReserveItem[]; amount?: number };

/** Step 1: pick Today or Tomorrow and a From/To time for each seller. Step 2: review everything and confirm. */
export function ReservePickupModal({ open, sellers, total, loading, error, onClose, onConfirm }: {
  open: boolean; sellers: ReserveSeller[]; total: string; loading: boolean; error: string; onClose: () => void;
  onConfirm: (pickups: PickupChoice[]) => void | Promise<void>;
}) {
  const [ranges, setRanges] = useState<Record<string, PickupRange>>({});
  const [step, setStep] = useState<"time" | "review">("time");
  const [left, setLeft] = useState<string[]>([]);
  useEffect(() => { if (open) { setRanges({}); setLeft([]); setStep("time"); } }, [open]);
  if (!open || typeof document === "undefined") return null;

  // A stall can be left out (for example, it has not set opening hours). The others still go through.
  const active = sellers.filter((seller) => !left.includes(seller.sellerId));
  const ready = active.length > 0 && active.every((seller) => ranges[seller.sellerId]);
  const shownTotal = sellers.every((seller) => seller.amount !== undefined)
    ? `₱${active.reduce((sum, seller) => sum + (seller.amount ?? 0), 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : total;
  const others = (id: string) => active.filter((s) => s.sellerId !== id).flatMap((s) => (ranges[s.sellerId] ? [{ start: ranges[s.sellerId]!.start, end: ranges[s.sellerId]!.end }] : []));
  const when = (range: NonNullable<PickupRange>) =>
    `${new Date(range.start).toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric", timeZone: "Asia/Manila" })}, ${formatPickupClock(range.start)} to ${formatPickupClock(range.end)}`;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Reserve for pickup">
      <div className="flex max-h-[92vh] min-h-[min(46rem,92vh)] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[#E5E2DA] p-5">
          <div>
            <h2 className="font-heading text-lg font-bold">{step === "time" ? "Choose your pickup time" : "Review your reservation"}</h2>
            <p className="text-xs text-neutral-600">{step === "time" ? "Two quick steps: pick a day, then a time." : "Check everything, then confirm."}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-11 items-center justify-center rounded-full hover:bg-neutral-100"><X className="size-5" /></button>
        </div>
        <div data-lenis-prevent className="flex-1 space-y-6 overflow-y-auto p-5">
          {step === "time" ? sellers.map((seller) => left.includes(seller.sellerId) ? (
            <section key={seller.sellerId} className="space-y-2 rounded-xl border border-dashed border-[#E5E2DA] p-4">
              <h3 className="text-sm font-bold">{seller.shopName}</h3>
              <p className="text-xs text-neutral-600">Left out. These items stay in your cart.</p>
              <button type="button" onClick={() => setLeft((current) => current.filter((id) => id !== seller.sellerId))} className="min-h-11 text-xs font-semibold text-[#244218] underline">Add this stall back</button>
            </section>
          ) : (
            <section key={seller.sellerId} className="space-y-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-neutral-500">Pickup from</p>
                  <h3 className="text-xl font-bold">{seller.shopName}</h3>
                </div>
                {sellers.length > 1 ? <button type="button" onClick={() => setLeft((current) => [...current, seller.sellerId])} className="min-h-11 text-xs font-semibold text-neutral-600 underline">Leave this stall out</button> : null}
              </div>
              <PickupPicker sellerId={seller.sellerId} value={ranges[seller.sellerId] ?? null} blocked={others(seller.sellerId)}
                onChange={(range) => setRanges((current) => ({ ...current, [seller.sellerId]: range }))} />
              {ranges[seller.sellerId] ? <p className="flex items-center gap-1.5 text-xs font-semibold text-[#244218]"><CalendarClock className="size-4" />{when(ranges[seller.sellerId]!)}</p> : null}
            </section>
          )) : active.map((seller) => (
            <section key={seller.sellerId} className="space-y-2 rounded-xl border border-[#E5E2DA] p-4">
              <h3 className="text-sm font-bold">{seller.shopName}</h3>
              {seller.address ? <p className="flex items-start gap-1.5 text-xs text-neutral-600"><MapPin className="mt-0.5 size-3.5 shrink-0" />{seller.address}</p> : null}
              <ul className="space-y-2 pt-1">
                {seller.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 rounded-xl border border-[#E5E2DA] p-2.5">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[#F8F6F1]">
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
              <p className="flex items-center gap-2 rounded-xl border border-[#457D00]/30 bg-[#F0F7EB] px-3 py-2.5 text-sm font-bold text-[#244218]"><CalendarClock className="size-5 shrink-0" />{when(ranges[seller.sellerId]!)}</p>
            </section>
          ))}
          {step === "review" ? <p className="text-sm font-semibold">Total to pay at pickup: {shownTotal}</p> : null}
          <p className="rounded-xl bg-[#FFF8E6] p-3 text-xs text-[#6B4E00]">{PICKUP_DISCLAIMER}</p>
          {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
        </div>
        <div className="flex gap-2 border-t border-[#E5E2DA] p-4">
          {step === "review" ? <button type="button" onClick={() => setStep("time")} disabled={loading} className="min-h-12 flex-1 rounded-xl border border-[#E5E2DA] text-sm font-semibold">Change time</button> : <button type="button" onClick={onClose} className="min-h-12 flex-1 rounded-xl border border-[#E5E2DA] text-sm font-semibold">Not now</button>}
          {step === "time"
            ? <button type="button" disabled={!ready} onClick={() => setStep("review")} className="min-h-12 flex-1 rounded-xl bg-[#457D00] text-sm font-semibold text-white disabled:opacity-50">Review order</button>
            : <button type="button" disabled={loading} onClick={() => void onConfirm(active.map((s) => ({ sellerId: s.sellerId, pickupStart: ranges[s.sellerId]!.start, pickupEnd: ranges[s.sellerId]!.end })))}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#457D00] text-sm font-semibold text-white disabled:opacity-60">
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}Confirm reservation</button>}
        </div>
      </div>
    </div>,
    document.body,
  );
}
