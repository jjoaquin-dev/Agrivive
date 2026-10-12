"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderReportIssueRowProps {
  onOpenReport: () => void;
}

export function OrderReportIssueRow({ onOpenReport }: OrderReportIssueRowProps) {
  return (
    <div className="border-t border-border/70 pt-4">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-destructive"
        onClick={onOpenReport}
      >
        <AlertTriangle className="size-4 text-amber-600" />
        Report an issue with this order
      </Button>
    </div>
  );
}
