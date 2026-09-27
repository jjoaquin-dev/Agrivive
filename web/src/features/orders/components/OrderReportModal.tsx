"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { AlertTriangle, CheckCircle2, FileText, Paperclip, UploadCloud, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  createBuyerOrderReport,
  uploadOrderReportEvidence,
  listOrderReportEvidence,
  type OrderReportEvidence,
  type ReportReason,
} from "../api/reports";

interface OrderReportModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const REASONS: { value: ReportReason; label: string; description: string }[] = [
  { value: "pickup_problem", label: "Pickup Problem", description: "Seller was absent or produce unavailable." },
  { value: "listing_inaccurate", label: "Listing Inaccurate", description: "Produce quality or quantity differed from description." },
  { value: "conduct", label: "Seller Conduct", description: "Unprofessional or inappropriate behavior." },
  { value: "other", label: "Other Issue", description: "Any other problem with this transaction." },
];

export function OrderReportModal({ orderId, isOpen, onClose }: OrderReportModalProps) {
  const [reason, setReason] = useState<ReportReason>("pickup_problem");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState("");
  const [submittedEvidence, setSubmittedEvidence] = useState<OrderReportEvidence[] | null>(null);

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
    if (details.trim().length < 5) {
      setError("Please provide at least 5 characters explaining what happened.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="size-5" />
        </button>

        {submittedEvidence !== null ? (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 text-emerald-600 font-heading font-bold text-lg">
              <CheckCircle2 className="size-6" /> Report Filed Successfully
            </div>
            <p className="text-sm text-muted-foreground">
              Your report and evidence have been recorded for platform monitoring.
            </p>
            {submittedEvidence.length > 0 && (
              <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-2">
                <p className="text-xs font-semibold text-foreground">Attached evidence files (links valid for 5 min):</p>
                {submittedEvidence.map((ev) => (
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
            <Button onClick={onClose} className="w-full">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-heading font-bold text-lg">
              <AlertTriangle className="size-5 text-amber-600" /> Report an Order Issue
            </div>
            <p className="text-xs text-muted-foreground">
              Reports are recorded to protect platform trust. Explain what happened below.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold">Reason for report</label>
              <div className="grid grid-cols-1 gap-2">
                {REASONS.map((r) => (
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
                      <p className="text-muted-foreground text-[11px]">{r.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="report-details" className="text-xs font-semibold">Details</label>
              <textarea
                id="report-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the issue in detail (pickup time, communication, discrepancy)..."
                maxLength={2000}
                rows={3}
                className="w-full rounded-xl border border-input bg-background p-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              />
              <p className="text-[11px] text-muted-foreground text-right">{details.length}/2000</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Paperclip className="size-3.5" /> Attach evidence (optional, max 5 files, 5 MB each)
              </label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 rounded-xl border border-dashed border-border px-3 py-2 text-xs font-medium text-primary hover:bg-primary/5 cursor-pointer">
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
                    <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-2.5 py-1 text-xs">
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
              <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
              <Button type="submit" disabled={submitting || details.trim().length < 5}>
                {submitting ? "Submitting…" : "Submit Report"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
