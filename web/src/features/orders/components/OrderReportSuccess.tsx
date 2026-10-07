"use client";

import { CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrderReportEvidence } from "../api/reports";

interface OrderReportSuccessProps {
  evidence: OrderReportEvidence[];
  onClose: () => void;
}

export function OrderReportSuccess({ evidence, onClose }: OrderReportSuccessProps) {
  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center gap-2 text-emerald-700 font-heading font-bold text-lg">
        <CheckCircle2 className="size-6 text-emerald-600" /> Report Filed Successfully
      </div>
      <p className="text-sm text-muted-foreground">
        Your report and evidence have been recorded for platform monitoring.
      </p>
      {evidence.length > 0 && (
        <div className="rounded-xl border border-border/70 bg-agrivive-background/60 p-3 space-y-2">
          <p className="text-xs font-semibold text-foreground">Attached evidence files (links valid for 5 min):</p>
          {evidence.map((ev) => (
            <div key={ev.id} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 truncate max-w-[240px]">
                <FileText className="size-3.5 text-primary shrink-0" />
                {(ev.sizeBytes / 1024).toFixed(0)} KB
              </span>
              <a
                href={ev.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
      <Button onClick={onClose} className="min-h-12 w-full rounded-xl font-semibold active:translate-y-px">
        Done
      </Button>
    </div>
  );
}
