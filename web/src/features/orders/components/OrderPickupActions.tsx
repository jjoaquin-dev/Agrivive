"use client";

import { useState } from "react";
import { CalendarClock, HandHelping, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiError } from "@/src/lib/api";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { answerReschedule, sendOrderExcuse, type ExcuseReason } from "../api/orders";
import { PickupDeclineModal } from "./PickupDeclineModal";

const when = (iso: string) => new Date(iso).toLocaleString("en-PH", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" });
const declineStatusText: Record<string, string> = {
  pending_seller: "The seller has 24 hours to accept or dispute your decline. Nobody gets points until it is settled.",
  seller_fault: "Your decline was accepted. You were not charged for the declined items.",
  buyer_invalid: "Your decline was not valid, so it counts like a late cancellation (1 point).",
  buyer_false_photo: "The system found this photo was already used on another decline (2 points).",
  disputed: "The seller disagreed with your decline. Nobody gets points. The order is closed as declined at pickup.",
  overturned: "This decision was overturned.",
};

/** Decline at pickup, explain a missed pickup, and answer a new pickup time offered by the seller. */
export function OrderPickupActions({ order, onChanged }: { order: BuyerOrder; onChanged: (order: BuyerOrder) => void }) {
  const [declineOpen, setDeclineOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [excuseReason, setExcuseReason] = useState<ExcuseReason>("rain");
  const [excuseDetails, setExcuseDetails] = useState("");

  const proposal = order.reschedules?.find((item) => item.status === "pending");
  const canDecline = order.status === "pending" && order.progress.current === "ready" && order.qr.status === "active" && !order.decline;
  const expiredAgo = order.expiredAt ? Date.now() - new Date(order.expiredAt).getTime() : null;
  const canExplain = order.status === "expired" && !order.excuse && expiredAgo !== null && expiredAgo <= 24 * 3_600_000 && !order.decline;

  async function run(action: () => Promise<BuyerOrder>) {
    setBusy(true); setError("");
    try { onChanged(await action()); } catch (reason) { setError(reason instanceof ApiError ? reason.message : "Something went wrong. Please try again."); } finally { setBusy(false); }
  }

  return (
    <div className="space-y-4">
      {proposal ? (
        <section className="rounded-2xl border border-[#D0E2FF] bg-[#F0F5FF] p-5" aria-label="New pickup time offered">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#1E3A8A]"><CalendarClock className="size-4" />The seller asks to move your pickup</h3>
          <p className="mt-2 text-sm text-[#1E3A8A]">New time: <strong>{when(proposal.newStart)}</strong> to {new Date(proposal.newEnd).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" })}</p>
          <p className="mt-1 text-xs text-[#1E3A8A]">Reason: {proposal.reason}. Your pickup stays the same until you accept.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" disabled={busy} onClick={() => void run(() => answerReschedule(order.id, false))} className="min-h-12 flex-1 rounded-xl border border-[#E5E2DA] bg-white text-sm font-semibold">Keep my time</button>
            <button type="button" disabled={busy} onClick={() => void run(() => answerReschedule(order.id, true))} className="min-h-12 flex-1 rounded-xl bg-[#457D00] text-sm font-semibold text-white">Accept new time</button>
          </div>
        </section>
      ) : null}

      {canDecline ? (
        <section className="flex flex-col gap-4 rounded-2xl border border-[#E5E2DA] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-700"><ShieldAlert className="size-5" aria-hidden="true" /></span>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#14231A]">Something wrong with the produce?</h3>
              <p className="mt-1 text-sm leading-snug text-neutral-600">Look over your items before the seller scans your QR. If there is a problem, decline here with a photo.</p>
            </div>
          </div>
          <button type="button" onClick={() => setDeclineOpen(true)} className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-xl border border-rose-300 bg-white px-5 text-sm font-semibold text-rose-700 hover:bg-rose-50 active:translate-y-px sm:w-auto">Decline at pickup</button>
          <PickupDeclineModal order={order} open={declineOpen} onClose={() => setDeclineOpen(false)} onDone={onChanged} />
        </section>
      ) : null}

      {order.decline ? (
        <Alert className="rounded-xl border-[#E5E2DA]"><AlertDescription><strong>Decline sent.</strong> {declineStatusText[order.decline.status] ?? ""}</AlertDescription></Alert>
      ) : null}

      {canExplain ? (
        <section className="rounded-2xl border border-[#E5E2DA] bg-white p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold"><HandHelping className="size-4" />Missed your pickup?</h3>
          <p className="mt-1 text-xs text-neutral-600">You have 24 hours to press &quot;I had a problem&quot;. If the seller confirms it, this adds 0 points. You can do this once every 30 days.</p>
          <label className="mt-3 block text-sm font-semibold">What happened?
            <select value={excuseReason} onChange={(event) => setExcuseReason(event.target.value as ExcuseReason)} className="mt-1 h-12 w-full rounded-xl border border-[#E5E2DA] px-3 text-sm font-normal">
              <option value="rain">Heavy rain</option><option value="sick">I was sick</option><option value="no_transport">No ride</option><option value="other">Something else</option>
            </select>
          </label>
          {excuseReason === "other" ? <textarea value={excuseDetails} onChange={(event) => setExcuseDetails(event.target.value)} maxLength={500} rows={2} placeholder="Tell us what happened" className="mt-2 w-full rounded-xl border border-[#E5E2DA] p-3 text-sm" /> : null}
          <button type="button" disabled={busy || (excuseReason === "other" && excuseDetails.trim().length < 5)} onClick={() => void run(() => sendOrderExcuse(order.id, excuseReason, excuseDetails))} className="mt-3 min-h-12 w-full rounded-xl bg-[#457D00] text-sm font-semibold text-white disabled:opacity-50 sm:w-auto sm:px-6">I had a problem</button>
        </section>
      ) : null}
      {order.excuse ? <Alert className="rounded-xl border-[#E5E2DA]"><AlertDescription><strong>Your explanation:</strong> {order.excuse.status === "pending" ? "waiting for the seller." : order.excuse.status === "confirmed" ? "accepted. This missed pickup adds 0 points." : "not accepted. The missed pickup rule applies."}</AlertDescription></Alert> : null}
      {order.noShow && !order.noShow.excused ? <Alert className="rounded-xl border-amber-300 bg-amber-50 text-amber-900"><AlertDescription>This was a missed pickup. It added 2 points to your score. You can explain what happened below.</AlertDescription></Alert> : null}
      {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
    </div>
  );
}
