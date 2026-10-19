"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiError, isAbortError } from "@/src/lib/api";
import { PageContainer } from "@/src/components/PageContainer";
import { authClient } from "@/src/lib/auth-client";
import { getMarketplaceProduct, getMarketplaceSeller } from "../../marketplace/api/marketplace";
import { listConversations, type Conversation } from "../api";
import { ConversationList } from "./ConversationList";
import { ConversationThread } from "./ConversationThread";
import { ConversationDetailsPanel } from "./ConversationDetailsPanel";
import { conversationContextId, launchContextFromConversation, type ConversationLaunchContext } from "../types";

function loginReturnPath() {
  if (typeof window === "undefined") return "/messages";
  return `${window.location.pathname}${window.location.search}`;
}

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
      ? getMarketplaceProduct(requestedProductId, controller.signal).then((product) => ({
        contextType: "product" as const,
        contextId: product.id,
        sellerId: product.seller.id,
        sellerName: product.seller.name,
        sellerShopName: product.seller.shopName,
        sellerImage: product.seller.image ?? null,
        productId: product.id,
        productName: product.productName,
        productImageUrl: product.imageUrl,
      }))
      : getMarketplaceSeller(requestedSellerId!, controller.signal).then((seller) => ({
        contextType: "seller" as const,
        contextId: seller.id,
        sellerId: seller.id,
        sellerName: seller.shopName,
        sellerShopName: seller.shopName,
        sellerImage: seller.image,
        productId: null,
        productName: null,
        productImageUrl: null,
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
  const launchMatch = launchContext
    ? items.find((item) => item.contextType === launchContext.contextType && conversationContextId(item) === launchContext.contextId) ?? null
    : null;
  const activeConversation = selectedConversation ?? launchMatch;
  const activeContext = activeConversation ? launchContextFromConversation(activeConversation) : launchContext;
  const hasSelection = Boolean(activeContext && !launchLoading);

  function handleSelect(item: Conversation) {
    router.replace(`/messages?conversationId=${encodeURIComponent(item.id)}`, { scroll: false });
  }

  function handleBack() {
    router.replace("/messages", { scroll: false });
  }

  function handleConversationCreated(conversation: Conversation) {
    router.replace(`/messages?conversationId=${encodeURIComponent(conversation.id)}`, { scroll: false });
    void load();
  }

  return (
    <PageContainer className="py-6 sm:py-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Communication</p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Messages</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Ask a seller about fresh produce, availability, the latest picture, or pickup details.</p>
      </div>

      {error ? <Alert variant="destructive" className="mb-5"><AlertTitle>Messages could not load</AlertTitle><AlertDescription>{error}</AlertDescription></Alert> : null}

      <div className="overflow-hidden rounded-[24px] border border-border/80 bg-white shadow-[0_18px_45px_rgba(31,77,58,0.10)]">
        <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_300px]">
          <ConversationList
            items={items}
            selectedId={activeConversation?.id ?? null}
            loading={loading}
            onSelect={handleSelect}
            className={hasSelection ? "hidden lg:flex" : "flex"}
          />
          <div className={hasSelection ? "flex min-w-0" : "hidden lg:flex min-w-0"}>
            {activeContext ? (
              <ConversationThread
                context={activeContext}
                existing={activeConversation}
                onBack={handleBack}
                onConversationCreated={handleConversationCreated}
              />
            ) : (
              <div className="flex min-h-[680px] flex-1 flex-col items-center justify-center bg-[#fbfaf7] px-8 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden="true">✦</span>
                <h2 className="mt-4 font-heading text-xl font-bold">Choose a conversation</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Select a seller message on the left, or open a product or seller page to start a new conversation.</p>
              </div>
            )}
          </div>
          {activeContext ? (
            <div className="hidden xl:flex">
              <ConversationDetailsPanel context={activeContext} />
            </div>
          ) : null}
        </div>
      </div>
    </PageContainer>
  );
}
