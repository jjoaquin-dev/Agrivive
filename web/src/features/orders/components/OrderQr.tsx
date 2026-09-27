"use client";

import { QRCodeSVG } from "qrcode.react";
import { Clock, QrCode, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderQrProps {
  payload: string | null;
  status: string;
  orderId?: string;
  shopName?: string;
}

export function OrderQr({ payload, status, orderId, shopName }: OrderQrProps) {
  if (!payload || status !== "pending") {
    return (
      <Card className="overflow-hidden border-border/80 bg-white">
        <CardHeader className="bg-muted/40 pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <QrCode className="size-4 text-muted-foreground" aria-hidden="true" />
            Pickup pass inactive
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-sm leading-6 text-muted-foreground">
          {status === "completed"
            ? "This reservation was picked up and completed. Thank you for supporting local Davao farmers!"
            : "Pickup passes are only active while reservations are pending pickup at the market stall."}
        </CardContent>
      </Card>
    );
  }

  const shortCode = orderId ? `AGR-${orderId.slice(0, 6).toUpperCase()}` : "AGR-PASS";

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-agrivive-primary/30 bg-white shadow-md">
      {/* Official ticket header banner */}
      <div className="bg-agrivive-primary px-5 py-3 text-white">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-agrivive-sage">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Official Pickup Pass
          </span>
          <span className="font-mono text-xs font-bold text-white/90">{shortCode}</span>
        </div>
        {shopName ? (
          <p className="mt-1 text-xs text-white/80">Stall: <span className="font-semibold text-white">{shopName}</span></p>
        ) : null}
      </div>

      {/* Ticket QR Body */}
      <div className="flex flex-col items-center px-5 py-6 text-center">
        <div className="rounded-xl border border-border bg-white p-3 shadow-inner">
          <QRCodeSVG value={payload} size={200} level="M" includeMargin aria-label="Reservation QR code" />
        </div>
        <p className="mt-4 font-heading text-sm font-bold text-foreground">
          Show this code to the vendor
        </p>
        <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
          The seller will scan your code to confirm your produce reservation.
        </p>

        {/* 24-hr Hold Security Pill */}
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/80 px-3 py-1 text-xs font-medium text-amber-900">
          <Clock className="size-3 text-amber-700" aria-hidden="true" />
          <span>Pay in person at stall pickup</span>
        </div>
      </div>

      {/* Decorative Ticket Perforation Line */}
      <div className="relative border-t border-dashed border-border px-5 py-2.5 bg-agrivive-background/60 text-center">
        <span className="text-[11px] text-muted-foreground">Present before reservation expiration</span>
      </div>
    </div>
  );
}
