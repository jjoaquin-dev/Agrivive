"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCheck, MessageCircle, Send, Store } from "lucide-react";
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
    <section className="flex min-h-[680px] flex-1 flex-col bg-[#fbfaf7]" aria-label={`Conversation with ${sellerName}`}>
      <header className="flex items-center gap-3 border-b border-border/70 bg-white px-4 py-4 sm:px-6">
        <Button type="button" variant="ghost" size="icon" onClick={onBack} className="lg:hidden" aria-label="Back to messages"><ArrowLeft className="size-5" /></Button>
        {context.sellerImage ? <img src={context.sellerImage} alt="" className="size-11 rounded-2xl object-cover ring-1 ring-primary/15" /> : <span className="flex size-11 items-center justify-center rounded-2xl bg-agrivive-background text-primary ring-1 ring-primary/15"><Store className="size-5" aria-hidden="true" /></span>}
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-heading text-lg font-bold">{sellerName}</h2>
          <p className="truncate text-xs text-muted-foreground">Live conversation with the seller</p>
        </div>
        <MessageCircle className="size-5 text-primary" aria-hidden="true" />
      </header>

      <ConversationContextCard context={context} />

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {thread.loading ? <div className="space-y-3"><div className="h-14 w-3/5 animate-pulse rounded-2xl bg-muted" /><div className="ml-auto h-14 w-2/5 animate-pulse rounded-2xl bg-muted" /></div> : null}
        {!thread.loading && thread.messages.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><MessageCircle className="size-7" aria-hidden="true" /></span>
            <h3 className="mt-4 font-heading text-lg font-bold">Start a conversation</h3>
            <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">Ask {sellerName} about this produce, the latest picture, availability, or pickup details.</p>
          </div>
        ) : null}
        {!thread.loading ? thread.messages.map((item) => {
          const isMine = Boolean(thread.conversation && item.senderId === thread.conversation.buyerId);
          return (
            <div key={item.id} className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[min(80%,520px)] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-xs ${isMine ? "rounded-br-md bg-primary text-white" : "rounded-bl-md border border-border/70 bg-white text-foreground"}`}>
                  {item.body}
                </div>
                <span className="mt-1 flex items-center gap-1 px-1 text-[11px] text-muted-foreground">
                  {formatMessageTime(item.createdAt)}{isMine ? <CheckCheck className="size-3 text-primary" aria-label="Sent" /> : null}
                </span>
              </div>
            </div>
          );
        }) : null}
        <div ref={endOfMessages} />
      </div>

      {thread.requiresAuth ? (
        <div className="border-t border-border/70 bg-white p-4 sm:p-6"><p className="text-sm text-muted-foreground">Sign in to message this seller.</p><Link href="/login?next=%2Fmessages" className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white">Sign in to message</Link></div>
      ) : (
        <div className="border-t border-border/70 bg-white p-3 sm:p-4">
          {thread.error ? <Alert variant="destructive" className="mb-3"><AlertDescription>{thread.error}</AlertDescription></Alert> : null}
          {!thread.conversation ? <div className="mb-2 flex flex-wrap gap-2"><button type="button" onClick={() => setDraft("Can you send the latest picture of this product?")} className="rounded-full border border-border/80 bg-agrivive-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40">Ask for latest picture</button><button type="button" onClick={() => setDraft("Is this still available?")} className="rounded-full border border-border/80 bg-agrivive-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40">Ask about availability</button></div> : null}
          <form onSubmit={handleSend} className="flex items-end gap-2 rounded-2xl border border-border/80 bg-[#fbfaf7] p-2 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
            <label htmlFor="conversation-message-input" className="sr-only">Write a message</label>
            <textarea id="conversation-message-input" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleKeyDown} placeholder="Write a message" maxLength={2000} rows={1} disabled={thread.sending} className="max-h-32 min-h-11 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm leading-6 outline-none placeholder:text-muted-foreground disabled:opacity-60" />
            <Button type="submit" size="icon" disabled={thread.sending || !draft.trim()} aria-label={thread.sending ? "Sending message" : "Send message"} className="size-11 shrink-0 rounded-xl"><Send className="size-4" aria-hidden="true" /></Button>
          </form>
          <p className="mt-2 px-2 text-[11px] text-muted-foreground">Press Enter to send · Shift + Enter for a new line</p>
        </div>
      )}
    </section>
  );
}
