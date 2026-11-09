"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, Loader2, RefreshCw, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiError } from "@/src/lib/api";
import type { BuyerOrder } from "@/src/features/marketplace/types";
import { declineReasons } from "@/src/features/reservation/declineReasons";
import { sendPickupDecline } from "../api/orders";

/** Inspect first, then decline: pick a reason, take a photo with the camera in the app, send. Old pictures cannot be uploaded. */
export function PickupDeclineModal({ order, open, onClose, onDone }: { order: BuyerOrder; open: boolean; onClose: () => void; onDone: (order: BuyerOrder) => void }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<{ blob: Blob; url: string; at: string } | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => { stream.current?.getTracks().forEach((track) => track.stop()); stream.current = null; }, []);
  const startCamera = useCallback(async () => {
    setCameraError("");
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      if (video.current) video.current.srcObject = stream.current;
    } catch { setCameraError("We could not open the camera. Allow camera access in your browser, then try again."); }
  }, []);

  useEffect(() => {
    if (!open) return;
    setReason(""); setDetails(""); setAmounts({}); setPhoto(null); setError("");
    void startCamera();
    return stopCamera;
  }, [open, startCamera, stopCamera]);

  if (!open || typeof document === "undefined") return null;

  function snap() {
    const element = video.current;
    if (!element || !element.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = element.videoWidth; canvas.height = element.videoHeight;
    canvas.getContext("2d")?.drawImage(element, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      setPhoto({ blob, url: URL.createObjectURL(blob), at: new Date().toISOString() });
      stopCamera();
    }, "image/jpeg", 0.85);
  }

  async function retake() { if (photo) URL.revokeObjectURL(photo.url); setPhoto(null); await startCamera(); }

  async function send() {
    if (!photo || !reason) return;
    setSending(true); setError("");
    const chosen = order.items.map((item) => ({ itemId: item.id, quantity: Math.min(Number(amounts[item.id] ?? item.quantity), Number(item.quantity)) })).filter((item) => item.quantity > 0);
    if (!chosen.length) { setError("Choose at least one item to decline."); setSending(false); return; }
    try {
      onDone(await sendPickupDecline(order.id, { reason, details, photo: photo.blob, capturedAt: photo.at, items: chosen }));
      onClose();
    } catch (failure) {
      setError(failure instanceof ApiError ? failure.message : "We could not send your decline. Please try again.");
    } finally { setSending(false); }
  }

  const invalid = declineReasons.find((item) => item.key === reason && !item.valid);
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Decline at pickup">
      <div className="flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[#E5E2DA] p-5">
          <div><h2 className="font-heading text-lg font-bold">Decline at pickup</h2><p className="text-xs text-neutral-600">Look over your items first. Tell us what is wrong and take a photo.</p></div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-11 items-center justify-center rounded-full hover:bg-neutral-100"><X className="size-5" /></button>
        </div>
        <div data-lenis-prevent className="flex-1 space-y-5 overflow-y-auto p-5">
          <fieldset className="space-y-2">
            <legend className="text-sm font-bold">Why are you declining?</legend>
            {declineReasons.map((item) => (
              <label key={item.key} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#E5E2DA] px-3 text-sm has-[:checked]:border-[#457D00] has-[:checked]:bg-[#F0F7EB]">
                <input type="radio" name="decline-reason" value={item.key} checked={reason === item.key} onChange={() => setReason(item.key)} className="size-4 accent-[#457D00]" />{item.label}
              </label>
            ))}
          </fieldset>
          {invalid ? <Alert className="border-amber-300 bg-amber-50 text-amber-900"><AlertDescription>This reason is not allowed. It counts like a late cancellation and adds 1 point to your account.</AlertDescription></Alert> : null}
          <fieldset className="space-y-2">
            <legend className="text-sm font-bold">How much are you declining?</legend>
            {order.items.map((item) => (
              <label key={item.id} className="flex items-center justify-between gap-3 text-sm"><span>{item.productName} ({item.scalingType})</span>
                <input type="number" inputMode="decimal" min="0" max={Number(item.quantity)} step="0.01" value={amounts[item.id] ?? String(Number(item.quantity))}
                  onChange={(event) => setAmounts((current) => ({ ...current, [item.id]: event.target.value }))} className="h-11 w-24 rounded-lg border border-[#E5E2DA] px-2 text-right" aria-label={`Amount of ${item.productName} to decline`} /></label>
            ))}
            <p className="text-xs text-neutral-500">Leave the full amount to decline the whole order. Items you keep can still be picked up.</p>
          </fieldset>
          <label className="block space-y-1 text-sm font-bold">Tell us more (optional)
            <textarea value={details} onChange={(event) => setDetails(event.target.value)} maxLength={500} rows={2} className="w-full rounded-xl border border-[#E5E2DA] p-3 text-sm font-normal" />
          </label>
          <div className="space-y-2">
            <p className="text-sm font-bold">Photo of the produce</p>
            {photo ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="Your decline photo" className="w-full rounded-xl" />
                <button type="button" onClick={() => void retake()} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#457D00]"><RefreshCw className="size-4" />Take it again</button>
              </div>
            ) : cameraError ? (
              <Alert variant="destructive"><AlertDescription>{cameraError}</AlertDescription></Alert>
            ) : (
              <div className="space-y-2">
                <video ref={video} autoPlay playsInline muted className="aspect-[4/3] w-full rounded-xl bg-black object-cover" />
                <button type="button" onClick={snap} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#457D00] text-sm font-semibold text-white active:translate-y-px"><Camera className="size-4" />Take photo</button>
              </div>
            )}
            <p className="text-xs text-neutral-500">The photo must be taken now, in the app. Saved or old pictures cannot be used.</p>
          </div>
          {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
        </div>
        <div className="flex gap-2 border-t border-[#E5E2DA] p-4">
          <button type="button" onClick={onClose} className="min-h-12 flex-1 rounded-xl border border-[#E5E2DA] text-sm font-semibold">Keep my order</button>
          <button type="button" disabled={!reason || !photo || sending} onClick={() => void send()} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 text-sm font-semibold text-white disabled:opacity-50">
            {sending ? <Loader2 className="size-4 animate-spin" /> : null}Send decline</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
