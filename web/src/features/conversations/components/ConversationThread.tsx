"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MessageCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConversationThread } from "../hooks/useConversationThread";
import type { Conversation } from "../api";
import type { ConversationLaunchContext } from "../types";
import { ConversationContextCard } from "./ConversationContextCard";
import { ConversationMessageBubble } from "./ConversationMessageBubble";
import { ConversationInput } from "./ConversationInput";

function displayName(context: ConversationLaunchContext) {
  return context.sellerShopName || context.sellerName || "Seller";
}

export function ConversationThread({
  context,
  existing,
  onBack,
  onConversationCreated,
}: {
  context: ConversationLaunchContext;
  existing: Conversation | null;
  onBack: () => void;
  onConversationCreated: (conversation: Conversation) => void;
}) {
  const thread = useConversationThread(context.contextType, context.contextId, 0, existing?.id);
  const [headerAvatarFailed, setHeaderAvatarFailed] = useState(false);
  const endOfMessages = useRef<HTMLDivElement | null>(null);
  const announcedConversation = useRef<string | null>(existing?.id ?? null);
  const sellerName = displayName(context);

  useEffect(() => {
    if (!thread.conversation || thread.conversation.id === announcedConversation.current) return;
    announcedConversation.current = thread.conversation.id;
    onConversationCreated(thread.conversation);
  }, [onConversationCreated, thread.conversation]);

  useEffect(() => {
    endOfMessages.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread.messages.length]);

  return (
    <section className="flex min-h-[680px] flex-1 flex-col bg-[#FDFCFB]" aria-label={`Conversation with ${sellerName}`}>
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border/70 bg-white px-4 py-3.5 sm:px-6">
        <Button type="button" variant="ghost" size="icon" onClick={onBack} className="lg:hidden" aria-label="Back to messages">
          <ArrowLeft className="size-5" />
        </Button>
        {context.sellerImage && !headerAvatarFailed ? (
          <img
            src={context.sellerImage}
            alt=""
            className="size-10 rounded-full object-cover ring-2 ring-primary/10"
            onError={() => setHeaderAvatarFailed(true)}
          />
        ) : (
          <span className="flex size-10 items-center justify-center rounded-full bg-agrivive-background text-primary ring-2 ring-primary/10">
            <Store className="size-4" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-heading text-base font-bold text-foreground">{sellerName}</h2>
          <p className="truncate text-xs text-emerald-700 font-medium">Active now • Verified vendor</p>
        </div>
      </header>

      <ConversationContextCard context={context} />

      {/* Messages Feed */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {thread.loading ? (
          <div className="space-y-3">
            <div className="h-14 w-3/5 animate-pulse rounded-2xl bg-muted" />
            <div className="ml-auto h-14 w-2/5 animate-pulse rounded-2xl bg-muted" />
          </div>
        ) : null}

        {!thread.loading && thread.messages.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageCircle className="size-6" />
            </span>
            <h3 className="mt-3 font-heading text-base font-bold">Start a conversation</h3>
            <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
              Ask {sellerName} about surplus vegetables, fresh pictures, or stall pickup instructions.
            </p>
          </div>
        ) : null}

        {!thread.loading
          ? thread.messages.map((item) => (
              <ConversationMessageBubble
                key={item.id}
                item={item}
                isMine={Boolean(thread.conversation && item.senderId === thread.conversation.buyerId)}
                sellerImage={context.sellerImage}
              />
            ))
          : null}
        <div ref={endOfMessages} />
      </div>

      <ConversationInput
        onSendMessage={thread.send}
        sending={thread.sending}
        requiresAuth={thread.requiresAuth}
        error={thread.error}
      />
    </section>
  );
}
