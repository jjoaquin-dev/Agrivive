"use client";

import { useState, type FormEvent } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConversationThread } from "@/src/features/conversations/hooks/useConversationThread";

export function OrderMessages({ orderId, refreshKey = 0 }: { orderId: string; refreshKey?: number }) {
  const [message, setMessage] = useState("");
  const conversation = useConversationThread("order", orderId, refreshKey);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await conversation.send(message)) setMessage("");
  }

  return (
    <Card className="overflow-hidden rounded-[20px] border-border/80 bg-white shadow-[0_10px_24px_rgba(31,77,58,0.05)]">
      <CardHeader className="border-b border-border/60 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <MessageCircle className="size-4 text-agrivive-primary" aria-hidden="true" />
          Conversation with the seller
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {conversation.error ? <Alert variant="destructive"><AlertDescription>{conversation.error}</AlertDescription></Alert> : null}
        {conversation.loading ? <div className="h-20 animate-pulse rounded-xl bg-muted" /> : conversation.messages.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/70 p-4 text-sm leading-6 text-muted-foreground">
            Ask the seller about pickup details or this reservation.
          </p>
        ) : (
          <div className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-border/60 bg-agrivive-background/40 p-3">
            {conversation.messages.map((item) => (
              <div key={item.id} className="rounded-xl border border-border/60 bg-card p-4">
                <p className="text-xs font-semibold text-agrivive-primary">
                  {item.senderId === conversation.conversation?.buyerId ? "You" : "Seller"}
                </p>
                <p className="mt-1 text-sm leading-6 text-foreground">{item.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3 border-t border-border/60 pt-4">
          <label htmlFor="buyer-order-message" className="text-sm font-semibold">Write a message</label>
          <textarea
            id="buyer-order-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={2000}
            rows={3}
            disabled={conversation.sending}
            placeholder="Write a clear message about this reservation."
            className="w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">{message.length}/2000</span>
            <Button type="submit" disabled={conversation.sending || !message.trim()} className="min-h-11 gap-2">
              <Send className="size-4" aria-hidden="true" />
              {conversation.sending ? "Sending…" : "Send message"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
