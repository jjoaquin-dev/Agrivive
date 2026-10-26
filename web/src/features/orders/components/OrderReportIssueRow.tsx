"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderReportIssueRowProps {
  onOpenReport: () => void;
}

export function OrderReportIssueRow({ onOpenReport }: OrderReportIssueRowProps) {
  return (
    <div className="pt-1">
      <Button
        type="button"
        variant="ghost"
        className="min-h-[40px] h-10 gap-2 rounded-xl px-3 text-[14px] font-medium text-muted-foreground hover:bg-amber-50/50 hover:text-amber-800"
        onClick={onOpenReport}
      >
        <AlertTriangle className="size-4 text-[#FEA938]" />
        <span>Report an issue with this order</span>
      </Button>
    </div>
  );
}
