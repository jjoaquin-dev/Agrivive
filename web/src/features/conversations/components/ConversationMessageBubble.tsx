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
  sellerName,
}: {
  item: ConversationMessage;
  isMine: boolean;
  sellerImage: string | null;
  sellerName?: string;
}) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const { text, imageUrl } = parseMessageContent(item.body);

  // Special card style if message contains stall gallery
  const isGalleryCard = item.body.includes("STALL PRODUCT GALLERY");

  return (
    <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
      <div className={`flex max-w-[min(85%,500px)] gap-2.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
        {!isMine && (
          <div className="mt-1 size-7 shrink-0 overflow-hidden rounded-full ring-1 ring-neutral-200">
            {sellerImage && !avatarFailed ? (
              <img
                src={sellerImage}
                alt=""
                className="size-full object-cover"
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-[#EEF5E3] text-xs font-bold text-[#457D00]">
                <Store className="size-3.5" />
              </div>
            )}
          </div>
        )}

        {isGalleryCard ? (
          <div className="w-full rounded-2xl bg-[#386018] p-3 text-white shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/90">
              <span>Stall Product Gallery</span>
              <span className="text-xs text-white/75">3 Items</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="h-20 overflow-hidden rounded-xl bg-black/20">
                {imageUrl && <img src={imageUrl} alt="" className="size-full object-cover" />}
              </div>
              <div className="h-20 overflow-hidden rounded-xl bg-black/20">
                {imageUrl && <img src={imageUrl} alt="" className="size-full object-cover" />}
              </div>
              <div className="relative flex h-20 items-center justify-center overflow-hidden rounded-xl bg-black/40 text-sm font-bold text-white">
                <span>+1</span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
              isMine
                ? "rounded-br-xs bg-[#457D00] text-white"
                : "rounded-bl-xs border border-[#ECEEE4] bg-white text-[#202E1B]"
            }`}
          >
            {imageUrl && (
              <div className="mb-2 min-h-[140px] min-w-[200px] overflow-hidden rounded-xl bg-black/5">
                {!imageFailed ? (
                  <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="group relative block">
                    <img
                      src={imageUrl}
                      alt="Produce attachment"
                      className="max-h-60 w-full rounded-xl object-cover transition-opacity hover:opacity-90"
                      onError={() => setImageFailed(true)}
                    />
                    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-black/60 px-1.5 py-0.5 text-xs text-white backdrop-blur-xs">
                      <ExternalLink className="size-2.5" /> Full size
                    </span>
                  </a>
                ) : (
                  <div className="flex h-28 flex-col items-center justify-center gap-1 text-xs text-neutral-400">
                    <ImageOff className="size-4" />
                    <span>Could not load image</span>
                  </div>
                )}
              </div>
            )}
            {text ? <p className="whitespace-pre-wrap break-words">{text}</p> : null}
          </div>
        )}
      </div>

      <div className={`mt-1 flex items-center gap-1 px-1 text-xs text-[#9EA899] ${isMine ? "justify-end" : "justify-start ml-9"}`}>
        <span>{formatMessageTime(item.createdAt)}</span>
        {isMine ? <CheckCheck className="size-3 text-[#457D00]" aria-label="Delivered" /> : null}
      </div>
    </div>
  );
}
