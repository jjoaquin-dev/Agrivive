"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Store } from "lucide-react";
import { useConversationThread } from "../hooks/useConversationThread";
import type { Conversation } from "../api";
import type { ConversationLaunchContext } from "../types";
import { ConversationContextCard } from "./ConversationContextCard";
import { ConversationMessageBubble } from "./ConversationMessageBubble";
import { ConversationInput } from "./ConversationInput";
import { ConversationStateButtons } from "./ConversationStateActions";

function displayName(context: ConversationLaunchContext) {
  return context.sellerShopName || context.sellerName || "Seller";
}

export function ConversationThread({
  context,
  existing,
  onBack,
  onConversationCreated,
  onStateChanged,
}: {
  context: ConversationLaunchContext;
  existing: Conversation | null;
  onBack: () => void;
  onConversationCreated: (conversation: Conversation) => void;
  onStateChanged: () => void;
}) {
  const thread = useConversationThread(
    context.contextType,
    context.contextId,
    0,
    existing?.id,
    context.productId,
    onConversationCreated,
  );
  const [headerAvatarFailed, setHeaderAvatarFailed] = useState(false);
  const endOfMessages = useRef<HTMLDivElement | null>(null);
  const sellerName = displayName(context);

  useEffect(() => {
    endOfMessages.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread.messages.length]);

  return (
    <section
      className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl border border-[#E9EBE2] bg-white shadow-sm"
      aria-label={`Conversation with ${sellerName}`}
    >
      {/* Top Thread Header */}
      <header className="flex items-center justify-between border-b border-[#F0F2EB] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex size-8 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 lg:hidden"
            aria-label="Back to messages"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="relative">
            <div className="size-10 overflow-hidden rounded-full ring-2 ring-[#457D00]/20">
              {context.sellerImage && !headerAvatarFailed ? (
                <img
                  src={context.sellerImage}
                  alt=""
                  className="size-full object-cover"
                  onError={() => setHeaderAvatarFailed(true)}
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-[#EEF5E3] text-[#457D00]">
                  <Store className="size-4" />
                </div>
              )}
            </div>
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-[#457D00]" />
          </div>
          <div>
            <h2 className="font-heading text-sm font-bold text-[#202E1B]">{sellerName}</h2>
            <p className="text-xs text-[#457D00] font-medium">Active now • Verified vendor</p>
          </div>
        </div>
        {existing ? <ConversationStateButtons conversation={existing} onChanged={onStateChanged} /> : null}
      </header>

      {/* Date Divider Pill */}
      <div className="relative my-3 flex items-center justify-center px-6">
        <div className="absolute inset-x-6 h-px bg-[#F0F2EB]" />
        <span className="relative z-10 rounded-full border border-[#ECEEE2] bg-[#FAF9F3] px-3 py-0.5 text-xs font-medium text-[#8A9685]">
          Today
        </span>
      </div>

      {/* Produce Context Banner */}
      <ConversationContextCard context={context} />

      {/* Messages Scroll Feed */}
      <div data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto px-6 py-2">
        {thread.loading ? (
          <div className="space-y-3">
            <div className="h-12 w-2/5 animate-pulse rounded-2xl bg-neutral-100" />
            <div className="ml-auto h-12 w-3/5 animate-pulse rounded-2xl bg-neutral-100" />
          </div>
        ) : null}

        {!thread.loading && thread.messages.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#EEF5E3] text-[#457D00]">
              <Store className="size-5" />
            </span>
            <h3 className="mt-3 font-heading text-sm font-bold text-[#202E1B]">Start chatting with {sellerName}</h3>
            <p className="mt-1 max-w-xs text-xs text-[#7A8875]">
              Ask about current harvest, stall availability, or pickup hours.
            </p>
          </div>
        ) : null}

        {!thread.loading &&
          thread.messages.map((item) => (
            <ConversationMessageBubble
              key={item.id}
              item={item}
              isMine={Boolean(thread.conversation && item.senderId === thread.conversation.buyerId)}
              sellerImage={context.sellerImage}
              sellerName={sellerName}
            />
          ))}
        <div ref={endOfMessages} />
      </div>

      {/* Message Composer Area */}
      <ConversationInput
        onSendMessage={thread.send}
        sending={thread.sending}
        requiresAuth={thread.requiresAuth}
        error={thread.error}
      />
    </section>
  );
}
