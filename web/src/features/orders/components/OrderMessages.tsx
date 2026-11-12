"use client";

import { useState, type FormEvent } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useConversationThread } from "@/src/features/conversations/hooks/useConversationThread";
import { formatDateTime } from "@/src/lib/format";

export function OrderMessages({ orderId, refreshKey = 0 }: { orderId: string; refreshKey?: number }) {
  const [message, setMessage] = useState("");
  const conversation = useConversationThread("order", orderId, refreshKey);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await conversation.send(message)) setMessage("");
  }

  return (
    <div className="rounded-2xl border border-agrivive-line bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-5 text-agrivive-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-agrivive-ink">
          Conversation with the seller
        </h2>
      </div>

      <div className="mt-4 space-y-4">
        {conversation.error ? <Alert variant="destructive"><AlertDescription>{conversation.error}</AlertDescription></Alert> : null}

        {conversation.messages.length > 0 ? (
          <div data-lenis-prevent className="max-h-80 space-y-2.5 overflow-y-auto rounded-xl border border-agrivive-line bg-[#FAFAFA] p-3">
            {conversation.messages.map((item) => (
              <div key={item.id} className="rounded-xl border border-agrivive-line bg-white p-3">
                <p className="text-xs font-semibold text-agrivive-primary">
                  {item.senderId === conversation.conversation?.buyerId ? "You" : "Seller"}
                </p>
                <p className="mt-1 text-sm leading-5 text-foreground">{item.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(item.createdAt, { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-agrivive-border bg-agrivive-wash p-4 text-center">
            <p className="text-xs italic text-neutral-500">Ask the seller about pickup details or this reservation.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="buyer-order-message" className="block text-sm font-semibold text-neutral-800">
            Write a message
          </label>
          <textarea
            id="buyer-order-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={2000}
            rows={4}
            disabled={conversation.sending}
            placeholder="Write a clear message about this reservation…"
            className="w-full rounded-xl border border-agrivive-line bg-white p-3.5 text-sm text-foreground outline-none transition focus:border-agrivive-primary focus:ring-1 focus:ring-agrivive-primary disabled:opacity-50"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">{message.length}/2000</span>
            <Button
              type="submit"
              disabled={conversation.sending || !message.trim()}
              className="h-11 min-h-11 gap-2 rounded-xl bg-agrivive-primary hover:bg-agrivive-primary/90 px-5 text-sm font-semibold text-white cursor-pointer shadow-sm"
            >
              <Send className="size-4" aria-hidden="true" />
              {conversation.sending ? "Sending…" : "Send message"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
