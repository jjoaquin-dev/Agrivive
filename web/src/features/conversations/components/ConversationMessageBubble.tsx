"use client";

import { useState } from "react";
import { CheckCheck, ExternalLink, ImageOff, Store } from "lucide-react";
import type { ConversationMessage } from "../api";

function formatMessageTime(value: string) {
  return new Date(value).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
}

function parseMessageContent(text: string) {
  const match = text.match(/(https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|webp|gif)(?:\?[^\s]*)?)/i);
  if (!match) {
    return { text, imageUrl: null };
  }
  const imageUrl = match[1];
  const remainingText = text.replace(imageUrl, "").trim();
  return { text: remainingText, imageUrl };
}

export function ConversationMessageBubble({
  item,
  isMine,
  sellerImage,
}: {
  item: ConversationMessage;
  isMine: boolean;
  sellerImage: string | null;
}) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const { text, imageUrl } = parseMessageContent(item.body);

  return (
    <div className={`mb-4 flex gap-2.5 ${isMine ? "justify-end" : "justify-start"}`}>
      {!isMine && (
        <div className="mt-1 size-7 shrink-0 overflow-hidden rounded-full bg-muted">
          {sellerImage && !avatarFailed ? (
            <img
              src={sellerImage}
              alt=""
              className="size-full object-cover"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <div className="flex size-full items-center justify-center text-[10px] font-bold text-primary">
              <Store className="size-3" />
            </div>
          )}
        </div>
      )}
      <div className={`flex max-w-[min(85%,520px)] flex-col ${isMine ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
            isMine
              ? "rounded-br-sm bg-agrivive-primary text-white"
              : "rounded-bl-sm border border-border/80 bg-white text-foreground"
          }`}
        >
          {imageUrl && (
            <div className="mb-2 min-h-[140px] min-w-[200px] overflow-hidden rounded-xl bg-black/5">
              {!imageFailed ? (
                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="group relative block">
                  <img
                    src={imageUrl}
                    alt="Produce attachment"
                    className="max-h-64 w-full rounded-xl object-cover transition-opacity hover:opacity-90"
                    onError={() => setImageFailed(true)}
                  />
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-xs">
                    <ExternalLink className="size-2.5" /> Full size
                  </span>
                </a>
              ) : (
                <div className="flex h-32 flex-col items-center justify-center gap-1.5 p-3 text-xs text-muted-foreground">
                  <ImageOff className="size-5" />
                  <span>Could not load image</span>
                  <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                    Open link directly
                  </a>
                </div>
              )}
            </div>
          )}
          {text ? <p className="whitespace-pre-wrap break-words">{text}</p> : null}
        </div>
        <span className="mt-1 flex items-center gap-1 px-1 text-[10px] text-muted-foreground">
          {formatMessageTime(item.createdAt)}
          {isMine ? <CheckCheck className="size-3 text-agrivive-primary" aria-label="Sent" /> : null}
        </span>
      </div>
    </div>
  );
}
