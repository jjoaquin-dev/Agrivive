"use client";

import { useEscapeKey } from "../../../hooks/useEscapeKey";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { AlertTriangle, Paperclip, UploadCloud, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  createBuyerOrderReport,
  uploadOrderReportEvidence,
  listOrderReportEvidence,
  type OrderReportEvidence,
  type ReportReason,
} from "../api/reports";
import { OrderReportSuccess } from "./OrderReportSuccess";
import { REPORT_MIN_DETAILS, REPORT_REASONS, reportCountsHint } from "../reportReasons";

interface OrderReportModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderReportModal({ orderId, isOpen, onClose }: OrderReportModalProps) {
  const [reason, setReason] = useState<ReportReason>("pickup_problem");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState("");
  const [submittedEvidence, setSubmittedEvidence] = useState<OrderReportEvidence[] | null>(null);

  useEscapeKey(isOpen && !submitting, onClose);
  if (!isOpen) return null;

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setError("");
    const valid: File[] = [];
    for (const file of selected) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 5 MB file size limit.`);
        return;
      }
      valid.push(file);
    }
    if (files.length + valid.length > 5) {
      setError("You can attach a maximum of 5 evidence files.");
      return;
    }
    setFiles((prev) => [...prev, ...valid]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (details.trim().length < REPORT_MIN_DETAILS) {
      setError(`Please write at least ${REPORT_MIN_DETAILS} characters about what happened.`);
      return;
    }
    setSubmitting(true);
    setError("");
    setUploadStatus("Creating report record…");

    try {
      const report = await createBuyerOrderReport(orderId, reason, details.trim());
      for (let i = 0; i < files.length; i++) {
        setUploadStatus(`Uploading evidence file ${i + 1} of ${files.length}…`);
        await uploadOrderReportEvidence(orderId, report.id, files[i]);
      }
      setUploadStatus("Loading evidence links…");
      const evidence = await listOrderReportEvidence(orderId, report.id);
      setSubmittedEvidence(evidence);
    } catch (err: any) {
      setError(err?.message || "Failed to submit order report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs" role="dialog" aria-modal="true" aria-label="Report a problem">
      <div data-lenis-prevent className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card p-6 shadow-md max-h-[90vh] overflow-y-auto">
        <button type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-4 top-4 flex min-h-11 min-w-11 size-11 items-center justify-center rounded-xl p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        {submittedEvidence !== null ? (
          <OrderReportSuccess evidence={submittedEvidence} onClose={onClose} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-heading font-bold text-lg">
              <AlertTriangle className="size-5 text-amber-600" /> Report an Order Issue
            </div>
            <p className="text-xs text-muted-foreground">
              A report alone adds no points. You can report each order once. Only report what really happened: 3 reports in 14 days with none confirmed adds points to you.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold">Reason for report</label>
              <div className="grid grid-cols-1 gap-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer text-xs transition-colors ${
                      reason === r.value ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                      className="mt-0.5 text-primary"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{r.label}</p>
                      <p className="text-muted-foreground text-xs">{r.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{reportCountsHint(REPORT_REASONS.find((r) => r.value === reason)?.counts ?? false)}</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="report-details" className="text-xs font-semibold">Details</label>
              <textarea
                id="report-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the issue in detail (pickup time, communication, discrepancy)…"
                maxLength={2000}
                rows={3}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              />
              <p className="text-xs text-muted-foreground text-right">{details.length}/2000 · at least {REPORT_MIN_DETAILS} characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Paperclip className="size-3.5" /> Attach evidence (optional, max 5 files, 5 MB each)
              </label>
              <div className="flex items-center gap-2">
                <label className="flex min-h-11 items-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-2 text-xs font-medium text-primary hover:bg-primary/5 cursor-pointer">
                  <UploadCloud className="size-4" /> Choose files (JPG, PNG, WebP, PDF)
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={handleFileSelect}
                    className="sr-only"
                    disabled={submitting || files.length >= 5}
                  />
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-1">
                  {files.map((f, i) => (
                    <div key={i} className="flex min-h-9 items-center justify-between rounded-lg bg-muted/50 px-2.5 py-1 text-xs">
                      <span className="truncate max-w-[260px] text-muted-foreground">{f.name}</span>
                      <button type="button" onClick={() => removeFile(i)} className="text-destructive hover:underline ml-2">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
            {uploadStatus ? <p className="text-xs text-primary font-medium">{uploadStatus}</p> : null}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={submitting} className="min-h-12 rounded-xl">Cancel</Button>
              <Button type="submit" disabled={submitting || details.trim().length < REPORT_MIN_DETAILS} className="min-h-12 rounded-xl font-semibold active:translate-y-px">
                {submitting ? "Submitting…" : "Submit Report"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
