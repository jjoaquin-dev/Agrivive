"use client";

import { useState, type FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { disputeTrustEvent, type TrustEvent } from "../api/standing";
import { formatDate } from "@/src/lib/format";

const MIN_REASON = 10;
const outcome = { upheld: "Dispute accepted", rejected: "The event stays", unresolved: "Saved" } as const;

function DisputeForm({ event, onDone, onCancel }: { event: TrustEvent; onDone: () => void; onCancel: () => void }) {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ title: string; because: string } | null>(null);

  async function send(e: FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const sent = await disputeTrustEvent(event.id, reason.trim());
      setResult({ title: outcome[sent.result], because: sent.because });
    } catch (err: any) {
      setError(err?.message || "We could not send your dispute. Please try again.");
    } finally { setSaving(false); }
  }

  if (result) {
    return (
      <div className="mt-3 space-y-2">
        <Alert><AlertDescription><strong>{result.title}.</strong> {result.because} The system checked this against your records right away.</AlertDescription></Alert>
        <Button type="button" variant="outline" onClick={onDone} className="min-h-11 rounded-xl">Done</Button>
      </div>
    );
  }
  return (
    <form onSubmit={send} className="mt-3 space-y-2">
      <label htmlFor={`dispute-${event.id}`} className="text-xs font-semibold text-neutral-800">Why is this wrong?</label>
      <textarea id={`dispute-${event.id}`} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={1000} rows={3}
        placeholder="Write what really happened" className="w-full rounded-xl border border-input bg-background p-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30" />
      <p className="text-xs text-neutral-500">{reason.trim().length}/1000 · at least {MIN_REASON} characters</p>
      {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving} className="min-h-11 rounded-xl">Cancel</Button>
        <Button type="submit" disabled={saving || reason.trim().length < MIN_REASON} className="min-h-11 rounded-xl font-semibold">{saving ? "Sending…" : "Send Dispute"}</Button>
      </div>
    </form>
  );
}

/** Events that counted in the last 90 days. An event can be disputed for 7 days after it happens. */
export function TrustEventList({ events, onChanged }: { events: TrustEvent[]; onChanged: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!events.length) return <p className="text-sm text-neutral-600">No events yet. Nothing counted against you in the last 90 days.</p>;
  return (
    <ul className="space-y-3">
      {events.map((event) => (
        <li key={event.id} className="rounded-2xl border border-agrivive-border bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-neutral-900">{event.what}</p>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${event.counted ? "bg-amber-50 text-amber-800" : "bg-neutral-100 text-neutral-500"}`}>
              {event.counted ? `+${event.points}` : "Removed"}
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-600">{event.rule}</p>
          <p className="mt-1 text-xs text-neutral-500">{formatDate(event.createdAt, { month: "short", day: "numeric", year: "numeric" })}{event.disputeStatus ? ` · Dispute: ${event.disputeStatus}` : ""}</p>
          {event.canDispute && open !== event.id ? <Button type="button" variant="outline" onClick={() => setOpen(event.id)} className="mt-3 min-h-11 rounded-xl">Dispute</Button> : null}
          {open === event.id ? <DisputeForm event={event} onCancel={() => setOpen(null)} onDone={() => { setOpen(null); onChanged(); }} /> : null}
        </li>
      ))}
    </ul>
  );
}
