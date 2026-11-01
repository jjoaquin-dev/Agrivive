import Link from "next/link";
import { Download, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  generatedAt?: string;
  onDownloadPdf: () => void;
}

export const StakeholderHeaderComponent = ({ generatedAt, onDownloadPdf }: Props) => {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-3" /> Back to Home
          </Link>
          <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            City Planning & Agricultural Overview
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
            <ShieldCheck className="size-3.5" /> RA 10173 Non-PII Compliant
          </span>
        </div>
        <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Marketplace Monitoring & Analytics Portal
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Prepared for the City Agriculturist&apos;s Office (CAO) & City Economic Enterprises Office (CEEO)
        </p>
        {generatedAt && (
          <p className="mt-1 text-xs text-muted-foreground">
            Snapshot time: {new Date(generatedAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onDownloadPdf}
          className="h-12 gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          <Download className="size-4" /> Download PDF Report
        </Button>
      </div>
    </div>
  );
};
