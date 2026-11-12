"use client";

import { QRCodeSVG } from "qrcode.react";
import { CalendarClock, Clock, MapPin, Navigation } from "lucide-react";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { formatDate, formatTime } from "@/src/lib/format";
import { formatPeso } from "@/src/lib/money";

const clock = (iso: string | null) => (iso ? formatTime(iso, { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Manila" }) : "");
const date = (iso: string | null) => (iso ? formatDate(iso, { weekday: "short", month: "short", day: "numeric", timeZone: "Asia/Manila" }) : "");

const qrNote = {
  not_yet_valid: { label: "Not valid yet", tone: "bg-amber-50 text-amber-800", text: "Your QR starts working at the beginning of your pickup time." },
  active: { label: "Active", tone: "bg-green-50 text-green-800", text: "Show this to the vendor. You can use it until the time shown below. They will scan it to complete your pickup." },
  expired: { label: "Expired", tone: "bg-rose-50 text-rose-700", text: "This QR cannot be used or extended. Place a new order to get a new QR." },
} as const;

/** The reservation pass: QR, order number, stall, address and directions, items, pickup time, status and the quality notice. */
export function OrderQr({ order, buyerName, shopName }: { order: BuyerOrder; buyerName?: string | null; shopName?: string }) {
  const stall = order.stall;
  const reference = `RSV-${order.id.slice(0, 4).toUpperCase()}`;
  const open = order.status === "pending";
  const note = qrNote[order.qr.status];
  const total = formatPeso(order.totalAmount);

  return (
    <div className="overflow-hidden rounded-2xl border border-agrivive-line bg-white shadow-sm">
      <div className="flex items-center justify-between bg-agrivive-primary px-4 py-2.5 text-white">
        <span className="text-xs font-bold uppercase tracking-wider">Official pickup pass</span>
        <span className="text-xs font-semibold">{reference}</span>
      </div>
      <div className="space-y-4 p-5">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Stall</span>
          <h3 className="mt-0.5 text-lg font-bold text-agrivive-ink">{stall?.shopName ?? shopName ?? "Market stall"}</h3>
          {buyerName ? <p className="text-xs text-neutral-500">Reserved by {buyerName}</p> : null}
        </div>

        {order.qrPayload && open ? (
          <div className="flex flex-col items-center">
            <div className="flex aspect-square w-full max-w-[280px] items-center justify-center rounded-xl border border-[#F0F0F0] bg-white p-3">
              <QRCodeSVG value={order.qrPayload} size={256} style={{ width: "100%", height: "100%" }} level="M" marginSize={1} className={order.qr.status === "active" ? "" : "opacity-30"} />
            </div>
            <span className={`mt-3 rounded-full px-3 py-1 text-xs font-bold ${note.tone}`}>QR {note.label}</span>
            <p className="mt-2 max-w-[260px] text-center text-xs leading-relaxed text-neutral-500">{note.text}</p>
            {order.qr.validUntil ? <p className="mt-1 text-xs text-neutral-400">Works now until {clock(order.qr.validUntil)}, {date(order.qr.validUntil)}</p> : null}
          </div>
        ) : (
          <div className="rounded-xl bg-neutral-50 p-4 text-center">
            <p className="text-sm font-semibold text-neutral-700">Pickup pass {order.status === "completed" ? "used" : "inactive"}</p>
            <p className="mt-1 text-xs text-neutral-500">{order.status === "completed" ? "This pickup was completed. Thank you!" : "This order is closed, so its QR no longer works."}</p>
          </div>
        )}

        {order.pickupEnd ? (
          <p className="flex items-start gap-2 text-sm font-semibold text-[#14231A]">
            <CalendarClock className="mt-0.5 size-4 shrink-0 text-[#457D00]" aria-hidden="true" />
            <span>Pick up on or before {date(order.pickupEnd)}, {clock(order.pickupEnd)}</span>
          </p>
        ) : null}
        {order.qr.validUntil && order.qr.validUntil !== order.pickupEnd ? (
          <p className="pl-6 text-xs text-neutral-500">Your QR works until {date(order.qr.validUntil)}, {clock(order.qr.validUntil)}.</p>
        ) : null}
        {stall ? (
          <div className="space-y-1 text-sm">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-agrivive-primary" aria-hidden="true" /><span>{stall.address}</span></p>
            {stall.instructions ? <p className="pl-6 text-xs text-neutral-500">{stall.instructions}</p> : null}
            {stall.directionsUrl ? (
              <a href={stall.directionsUrl} target="_blank" rel="noreferrer" className="ml-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-agrivive-primary underline-offset-2 hover:underline">
                <Navigation className="size-4" aria-hidden="true" />Get directions
              </a>
            ) : null}
          </div>
        ) : null}

        <ul className="divide-y divide-[#F0F0F0] rounded-xl border border-[#F0F0F0] text-sm" aria-label="Ordered items">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2"><span>{item.productName}</span><span className="font-semibold">{Number(item.quantity)} {item.scalingType}</span></li>
          ))}
        </ul>
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-full bg-agrivive-mist px-3 py-1 font-bold capitalize text-agrivive-forest">{open ? order.progress.current.replace("preparing", "preparing") : order.status}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-[#FFF9EE] px-3 py-1 font-semibold text-[#8C5300]"><Clock className="size-3.5" aria-hidden="true" />Pay {total} at stall</span>
        </div>
        <p className="rounded-xl bg-amber-50 p-3 text-xs font-medium leading-relaxed text-amber-800">{order.disclaimer}</p>
      </div>
    </div>
  );
}
