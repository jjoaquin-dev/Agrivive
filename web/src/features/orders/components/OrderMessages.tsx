"use client";

import { useState, type FormEvent } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useConversationThread } from "@/src/features/conversations/hooks/useConversationThread";

export function OrderMessages({ orderId, refreshKey = 0 }: { orderId: string; refreshKey?: number }) {
  const [message, setMessage] = useState("");
  const conversation = useConversationThread("order", orderId, refreshKey);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await conversation.send(message)) setMessage("");
  }

  return (
    <div className="rounded-[16px] border border-[#E8E8E8] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <MessageSquare className="size-5 text-[#457D00]" aria-hidden="true" />
        <h2 className="text-[18px] font-semibold text-[#14231A]">
          Conversation with the seller
        </h2>
      </div>

      <div className="mt-4 space-y-4">
        {conversation.error ? <Alert variant="destructive"><AlertDescription>{conversation.error}</AlertDescription></Alert> : null}

        {conversation.messages.length > 0 ? (
          <div className="max-h-80 space-y-2.5 overflow-y-auto rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] p-3">
            {conversation.messages.map((item) => (
              <div key={item.id} className="rounded-xl border border-[#E8E8E8] bg-white p-3">
                <p className="text-[12px] font-semibold text-[#457D00]">
                  {item.senderId === conversation.conversation?.buyerId ? "You" : "Seller"}
                </p>
                <p className="mt-1 text-[13px] leading-5 text-foreground">{item.body}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[12px] border border-dashed border-[#E5E7EB] bg-[#F9FAFB] p-4 text-center">
            <p className="text-xs italic text-neutral-500">Ask the seller about pickup details or this reservation.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="buyer-order-message" className="block text-[13px] font-semibold text-neutral-800">
            Write a message
          </label>
          <textarea
            id="buyer-order-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={2000}
            rows={4}
            disabled={conversation.sending}
            placeholder="Write a clear message about this reservation..."
            className="w-full rounded-[14px] border border-[#E8E8E8] bg-white p-3.5 text-[14px] text-foreground outline-none transition focus:border-[#457D00] focus:ring-1 focus:ring-[#457D00] disabled:opacity-60"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">{message.length}/2000</span>
            <Button
              type="submit"
              disabled={conversation.sending || !message.trim()}
              className="h-10 min-h-[40px] gap-2 rounded-xl bg-[#457D00] hover:bg-[#386600] px-5 text-[14px] font-semibold text-white cursor-pointer shadow-2xs"
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
