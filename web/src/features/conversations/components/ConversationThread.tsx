"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCheck, MessageCircle, Paperclip, Send, Smile, Store } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useConversationThread } from "../hooks/useConversationThread";
import type { Conversation } from "../api";
import type { ConversationLaunchContext } from "../types";
import { ConversationContextCard } from "./ConversationContextCard";

function displayName(context: ConversationLaunchContext) {
  return context.sellerShopName || context.sellerName || "Seller";
}

function formatMessageTime(value: string) {
  return new Date(value).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
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
  const [draft, setDraft] = useState("");
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

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await thread.send(draft)) setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <section className="flex min-h-[680px] flex-1 flex-col bg-[#FDFCFB]" aria-label={`Conversation with ${sellerName}`}>
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border/70 bg-white px-4 py-3.5 sm:px-6">
        <Button type="button" variant="ghost" size="icon" onClick={onBack} className="lg:hidden" aria-label="Back to messages">
          <ArrowLeft className="size-5" />
        </Button>
        {context.sellerImage ? (
          <img src={context.sellerImage} alt="" className="size-10 rounded-full object-cover ring-2 ring-primary/10" />
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
          ? thread.messages.map((item) => {
              const isMine = Boolean(thread.conversation && item.senderId === thread.conversation.buyerId);
              return (
                <div key={item.id} className={`mb-4 flex gap-2.5 ${isMine ? "justify-end" : "justify-start"}`}>
                  {!isMine && (
                    <div className="size-7 shrink-0 overflow-hidden rounded-full bg-muted mt-1">
                      {context.sellerImage ? (
                        <img src={context.sellerImage} alt="" className="size-full object-cover" />
                      ) : (
                        <div className="flex size-full items-center justify-center text-[10px] font-bold text-primary">
                          <Store className="size-3" />
                        </div>
                      )}
                    </div>
                  )}
                  <div className={`max-w-[min(80%,520px)] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
                        isMine
                          ? "rounded-br-sm bg-agrivive-primary text-white"
                          : "rounded-bl-sm border border-border/80 bg-white text-foreground"
                      }`}
                    >
                      {item.body}
                    </div>
                    <span className="mt-1 flex items-center gap-1 px-1 text-[10px] text-muted-foreground">
                      {formatMessageTime(item.createdAt)}
                      {isMine ? <CheckCheck className="size-3 text-agrivive-primary" aria-label="Sent" /> : null}
                    </span>
                  </div>
                </div>
              );
            })
          : null}
        <div ref={endOfMessages} />
      </div>

      {/* Input Console matching reference */}
      {thread.requiresAuth ? (
        <div className="border-t border-border/70 bg-white p-4">
          <p className="text-sm text-muted-foreground">Sign in to message this seller.</p>
          <Link href="/login?next=%2Fmessages" className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white">
            Sign in to message
          </Link>
        </div>
      ) : (
        <div className="border-t border-border/70 bg-white p-3 sm:p-4">
          {thread.error ? (
            <Alert variant="destructive" className="mb-3 text-xs">
              <AlertDescription>{thread.error}</AlertDescription>
            </Alert>
          ) : null}

          <form onSubmit={handleSend} className="rounded-2xl border border-border/80 bg-white p-2.5 shadow-xs">
            <textarea
              id="conversation-message-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type message here..."
              maxLength={2000}
              rows={2}
              disabled={thread.sending}
              className="w-full resize-none border-0 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60"
            />
            <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <button type="button" aria-label="Attach file" className="flex size-8 items-center justify-center rounded-lg hover:bg-muted">
                  <Paperclip className="size-4" />
                </button>
                <button type="button" aria-label="Insert emoji" className="flex size-8 items-center justify-center rounded-lg hover:bg-muted">
                  <Smile className="size-4" />
                </button>
              </div>
              <Button type="submit" disabled={thread.sending || !draft.trim()} className="gap-1.5 rounded-xl px-4 py-2 font-semibold">
                <span>Send</span>
                <Send className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
