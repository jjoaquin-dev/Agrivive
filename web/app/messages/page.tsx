import { Suspense } from "react";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { BuyerConversations } from "@/src/features/conversations/components/BuyerConversations";

export default function MessagesPage() {
  return <><BuyerSiteHeader /><Suspense fallback={<main className="min-h-[calc(100vh-72px)] bg-background px-4 py-8 sm:px-6"><div className="mx-auto max-w-7xl"><div className="h-10 w-40 animate-pulse rounded-lg bg-muted" /><div className="mt-6 h-[680px] animate-pulse rounded-[24px] bg-muted" /></div></main>}><BuyerConversations /></Suspense></>;
}
