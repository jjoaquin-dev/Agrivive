"use client";

import { QRCodeSVG } from "qrcode.react";
import { Clock } from "lucide-react";

interface OrderQrProps {
  payload: string | null;
  status: string;
  orderId?: string;
  shopName?: string;
  totalAmount?: string | number;
}

export function OrderQr({ payload, status, shopName, totalAmount = "23.47" }: OrderQrProps) {
  if (!payload || status !== "pending") {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-sm text-center">
        <p className="text-[14px] font-semibold text-muted-foreground">Pickup pass inactive</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          {status === "completed" ? "This pickup was completed. Thank you!" : "Pass is active while order is pending."}
        </p>
      </div>
    );
  }

  const formattedTotal = Number(totalAmount).toFixed(2);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white shadow-sm">
      {/* Official Header Banner */}
      <div className="bg-[#457D00] py-2.5 px-4 text-center">
        <span className="text-[12px] font-bold tracking-wider text-white uppercase">
          OFFICIAL PICKUP PASS
        </span>
      </div>

      {/* Ticket Body */}
      <div className="flex flex-col items-center p-6 text-center">
        <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
          STALL
        </span>
        <h3 className="mt-0.5 text-[18px] font-bold text-[#14231A]">
          {shopName || "Market Stall"}
        </h3>

        {/* QR Code */}
        <div className="mt-3 flex size-[150px] items-center justify-center rounded-xl border border-[#F0F0F0] bg-white p-2">
          <QRCodeSVG value={payload} size={134} level="M" includeMargin />
        </div>

        <p className="mt-4 text-[13px] font-bold text-[#14231A]">
          Show this to the vendor
        </p>
        <p className="mt-1 max-w-[220px] text-[12px] leading-relaxed text-neutral-500">
          The seller will scan this code to confirm your pickup.
        </p>

        {/* Pay at stall pill */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-[#FFF9EE] px-4 py-1.5 text-[12px] font-semibold text-[#8C5300]">
          <Clock className="size-3.5 text-[#8C5300]" aria-hidden="true" />
          <span>Pay ₱{formattedTotal} at stall</span>
        </div>
      </div>
    </div>
  );
}
