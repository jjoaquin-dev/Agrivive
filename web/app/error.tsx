"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <BuyerSiteHeader />
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 py-16 text-center text-agrivive-ink">
        <h1 className="font-heading text-3xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-lg text-agrivive-stone">Please try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-agrivive-primary px-5 text-base font-semibold text-white transition-colors hover:bg-agrivive-primary/90">
            <RotateCcw aria-hidden="true" size={18} />Try again
          </button>
          <Link href="/" className="inline-flex min-h-12 items-center rounded-xl border border-agrivive-border px-5 text-base font-semibold">Go home</Link>
        </div>
      </main>
    </>
  );
}
