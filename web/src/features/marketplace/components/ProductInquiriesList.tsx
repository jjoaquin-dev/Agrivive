"use client";

import { CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { BuyerProductInquiry } from "../api/inquiries";

type ProductInquiriesListProps = {
  loading: boolean;
  inquiries: BuyerProductInquiry[];
};

export function ProductInquiriesList({ loading, inquiries }: ProductInquiriesListProps) {
  return (
    <div>
      <h3 className="font-heading text-base font-semibold">Your previous questions</h3>
      {loading ? (
        <div className="mt-3 space-y-3">
          <div className="h-20 animate-pulse rounded-2xl bg-card" />
          <div className="h-20 animate-pulse rounded-2xl bg-card" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="mt-3 rounded-[20px] border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          You haven’t asked any questions about this listing yet.
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="gap-2 rounded-[18px] border-border/80 p-4 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  <span className="font-semibold text-primary">You:</span> {inquiry.question}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(inquiry.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {inquiry.reply ? (
                <div className="mt-2.5 rounded-xl border border-border/60 bg-agrivive-surface p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <CheckCircle2 className="size-3.5" />
                    <span>Seller reply:</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{inquiry.reply}</p>
                  {inquiry.repliedAt ? (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Answered on{" "}
                      {new Date(inquiry.repliedAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-600">
                  <Clock className="size-3.5" />
                  <span>Awaiting seller response</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
