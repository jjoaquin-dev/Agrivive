"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import type { Conversation, ConversationStateAction } from "../api";
import { conversationStateActions, runConversationStateAction } from "./ConversationStateActions";

/** The meatball menu on each conversation row: archive and block. */
export function ConversationRowMenu({ item, onChanged }: { item: Conversation; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [open]);

  async function handle(action: ConversationStateAction) {
    setOpen(false);
    try {
      if (await runConversationStateAction(item, action)) onChanged();
    } catch {
      // The list stays as it was; the next refresh shows the real state.
    }
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        aria-label={`More options for ${item.sellerShopName || item.sellerName}`}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex size-8 items-center justify-center rounded-full text-[#7A8875] hover:bg-[#F0F2EB] hover:text-[#202E1B] cursor-pointer"
      >
        <MoreVertical className="size-4" aria-hidden="true" />
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 top-full z-20 mt-1 w-36 rounded-2xl border border-[#E9EBE2] bg-white p-1.5 shadow-md">
          {conversationStateActions(item).map(({ action, label, danger }) => (
            <button
              key={action}
              type="button"
              role="menuitem"
              onClick={() => handle(action)}
              className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-xs font-semibold cursor-pointer ${
                danger ? "text-rose-700 hover:bg-rose-50" : "text-[#25431D] hover:bg-[#F6F8ED]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
