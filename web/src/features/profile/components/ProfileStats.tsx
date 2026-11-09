"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listBuyerOrders } from "@/src/features/orders/api/orders";

type Counts = { completed: number; pending: number; cancelled: number; expired: number };

const CARDS: { key: keyof Counts; label: string; note: string; tone: string }[] = [
  { key: "completed", label: "Completed Orders", note: "Picked up", tone: "text-[#16A34A]" },
  { key: "pending", label: "Current Reservations", note: "Waiting for pickup", tone: "text-[#457D00]" },
  { key: "cancelled", label: "Cancelled", note: "Reservations cancelled", tone: "text-amber-600" },
  { key: "expired", label: "Expired", note: "Not picked up in time", tone: "text-rose-600" },
];

// shortcut: counts by reading up to 10 pages of 20 orders; upgrade to a count endpoint if buyers pass 200 orders.
async function countOrders(signal: AbortSignal): Promise<Counts> {
  const counts: Counts = { completed: 0, pending: 0, cancelled: 0, expired: 0 };
  let cursor: string | undefined;
  for (let page = 0; page < 10; page++) {
    const res = await listBuyerOrders(cursor, signal);
    for (const order of res.orders) counts[order.status]++;
    if (!res.nextCursor) break;
    cursor = res.nextCursor;
  }
  return counts;
}

export function ProfileStats() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    countOrders(controller.signal)
      .then(setCounts)
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, []);

  return (
    <section aria-labelledby="order-summary-heading">
      <div className="flex items-baseline justify-between">
        <h2 id="order-summary-heading" className="font-heading text-lg font-bold text-neutral-900">Your Orders</h2>
        <Link href="/orders" className="text-xs font-semibold text-[#457D00] hover:underline">View all</Link>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {CARDS.map((card) => (
          <div key={card.key} className="rounded-2xl border border-[#E5E2DA] bg-white p-4 shadow-[0_4px_20px_rgba(20,35,26,0.05)]">
            <p className="text-xs font-medium text-neutral-600">{card.label}</p>
            <p className={`mt-1.5 font-heading text-3xl font-bold tabular-nums ${card.tone}`}>
              {counts ? counts[card.key] : failed ? "–" : <span className="inline-block h-8 w-10 animate-pulse rounded bg-neutral-100" />}
            </p>
            <p className="mt-1 text-xs text-neutral-500">{card.note}</p>
          </div>
        ))}
      </div>
      {failed ? <p role="alert" className="mt-2 text-xs text-rose-700">Could not load your order counts. Try again later.</p> : null}
    </section>
  );
}
