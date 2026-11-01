"use client";

import { Breadcrumbs } from "@/src/components/Breadcrumbs";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiError, isAbortError } from "@/src/lib/api";
import { authClient } from "@/src/lib/auth-client";
import { getMarketplaceProduct, getMarketplaceSeller } from "../../marketplace/api/marketplace";
import { listConversations, type Conversation } from "../api";
import { ConversationList } from "./ConversationList";
import { ConversationThread } from "./ConversationThread";
import { ConversationDetailsPanel } from "./ConversationDetailsPanel";
import { conversationContextId, launchContextFromConversation, type ConversationLaunchContext } from "../types";

const loginReturnPath = () => (typeof window === "undefined" ? "/messages" : `${window.location.pathname}${window.location.search}`);

export function BuyerConversations() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [launchContext, setLaunchContext] = useState<ConversationLaunchContext | null>(null);
  const [launchLoading, setLaunchLoading] = useState(false);

  const requestedConversationId = searchParams?.get("conversationId") ?? null;
  const requestedProductId = searchParams?.get("productId") ?? null;
  const requestedSellerId = searchParams?.get("sellerId") ?? null;

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    try {
      setItems(await listConversations(signal));
    } catch (reason) {
      if (isAbortError(reason)) return;
      if (reason instanceof ApiError && reason.status === 401) {
        router.replace(`/login?next=${encodeURIComponent(loginReturnPath())}`);
        return;
      }
      setError(reason instanceof ApiError ? reason.message : "We could not load your conversations.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (sessionPending) return;
    if (!session?.user) {
      router.replace(`/login?next=${encodeURIComponent(loginReturnPath())}`);
      return;
    }
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load, router, session?.user?.id, sessionPending]);

  useEffect(() => {
    if (!requestedProductId && !requestedSellerId) {
      setLaunchContext(null);
      setLaunchLoading(false);
      return;
    }

    const controller = new AbortController();
    setLaunchLoading(true);
    setError("");
    const request = requestedProductId
      ? getMarketplaceProduct(requestedProductId, controller.signal).then((p) => ({
        contextType: "product" as const, contextId: p.id, sellerId: p.seller.id,
        sellerName: p.seller.name, sellerShopName: p.seller.shopName, sellerImage: p.seller.image ?? null,
        productId: p.id, productName: p.productName, productImageUrl: p.imageUrl,
        productPrice: p.productPrice, scalingType: p.scalingType, productQty: p.productQty,
      }))
      : getMarketplaceSeller(requestedSellerId!, controller.signal).then((s) => ({
        contextType: "seller" as const, contextId: s.id, sellerId: s.id,
        sellerName: s.shopName, sellerShopName: s.shopName, sellerImage: s.image,
        productId: null, productName: null, productImageUrl: null,
      }));

    void request
      .then((context) => { if (!controller.signal.aborted) setLaunchContext(context); })
      .catch((reason) => {
        if (!isAbortError(reason) && !controller.signal.aborted) setError(reason instanceof ApiError ? reason.message : "We could not open this conversation.");
      })
      .finally(() => { if (!controller.signal.aborted) setLaunchLoading(false); });
    return () => controller.abort();
  }, [requestedProductId, requestedSellerId]);

  const selectedConversation = items.find((item) => item.id === requestedConversationId) ?? null;
  const productMatch = requestedProductId ? items.find((i) => i.productId === requestedProductId) ?? null : null;
  const sellerMatch = launchContext ? items.find((i) => i.sellerId === launchContext.sellerId) ?? null : null;
  const matched = selectedConversation ?? productMatch ?? sellerMatch;
  const activeConversation = matched ?? (launchContext ? null : items[0] ?? null);
  const activeContext = launchContext
    ? {
        ...(activeConversation ? launchContextFromConversation(activeConversation) : {}),
        ...launchContext,
        productId: launchContext.productId,
        productName: launchContext.productName,
        productImageUrl: launchContext.productImageUrl,
        productPrice: launchContext.productPrice,
        scalingType: launchContext.scalingType,
        productQty: launchContext.productQty,
      }
    : activeConversation ? launchContextFromConversation(activeConversation) : null;
  const hasSelection = Boolean(activeContext && !launchLoading);

  const handleSelect = (item: Conversation) => router.replace(`/messages?conversationId=${encodeURIComponent(item.id)}`, { scroll: false });
  const handleBack = () => router.replace("/messages", { scroll: false });
  const handleConversationCreated = (conv: Conversation) => {
    const params = new URLSearchParams();
    params.set("conversationId", conv.id);
    if (requestedProductId) params.set("productId", requestedProductId);
    router.replace(`/messages?${params.toString()}`, { scroll: false });
    void load();
  };

  return (
    <main className="min-h-[calc(100vh-70px)] bg-[#FDFDFD] p-3 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1720px]">
        {/* Navigation Link in Upper Left */}
        <div className="mb-6">
          <Breadcrumbs items={activeContext?.productId ? [{ label: "Listing", href: `/marketplace/${activeContext.productId}` }, { label: "Messages" }] : [{ label: "Messages" }]} />
        </div>

        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Messages could not load</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex h-[calc(100vh-140px)] min-h-[640px] gap-4">
          {/* Left Column: Messages List Card */}
          <div className={`w-full lg:w-[320px] shrink-0 ${hasSelection ? "hidden lg:flex" : "flex"}`}>
            <ConversationList
              items={items}
              selectedId={activeConversation?.id ?? null}
              loading={loading}
              onSelect={handleSelect}
              className="w-full"
            />
          </div>

          {/* Center Column: Conversation Thread Card */}
          <div className={`flex min-w-0 flex-1 ${hasSelection ? "flex" : "hidden lg:flex"}`}>
            {activeContext ? (
              <ConversationThread
                context={activeContext}
                existing={activeConversation}
                onBack={handleBack}
                onConversationCreated={handleConversationCreated}
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-[26px] border border-[#E9EBE2] bg-white p-8 text-center shadow-xs">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-[#EEF5E3] text-[#386600]" aria-hidden="true">
                  ✦
                </span>
                <h2 className="mt-4 font-heading text-xl font-bold text-neutral-800">Choose a conversation</h2>
                <p className="mt-2 max-w-sm text-sm text-[#7A8875]">
                  Select a message on the left or inquire on a marketplace produce to start chatting.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Chat Details & Vendor Info Card */}
          {activeContext ? (
            <div className="hidden xl:flex w-[330px] shrink-0">
              <ConversationDetailsPanel context={activeContext} />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
