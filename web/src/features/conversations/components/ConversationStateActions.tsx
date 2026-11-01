"use client";

import { useState } from "react";
import { Archive, ArchiveRestore, Ban, Undo2 } from "lucide-react";
import { setConversationState, type Conversation, type ConversationStateAction } from "../api";

type StateAction = { action: ConversationStateAction; label: string; danger?: boolean };

/** Archive or unarchive, then block or unblock, depending on the current state. */
export function conversationStateActions(item: Conversation): StateAction[] {
  return [
    item.archivedAt
      ? { action: "unarchive", label: "Unarchive" }
      : { action: "archive", label: "Archive" },
    item.myBlockedAt
      ? { action: "unblock", label: "Unblock" }
      : { action: "block", label: "Block", danger: true },
  ];
}

/** Runs one state change. Asks first before blocking. */
export async function runConversationStateAction(item: Conversation, action: ConversationStateAction) {
  if (action === "block" && !window.confirm("Block this seller? You will not get or send messages in this chat.")) return false;
  await setConversationState(item.id, action);
  return true;
}

/** Archive and block buttons for the thread header and seller info panel. */
export function ConversationStateButtons({ conversation, onChanged }: { conversation: Conversation; onChanged: () => void }) {
  const [error, setError] = useState("");

  async function handle(action: ConversationStateAction) {
    setError("");
    try {
      if (await runConversationStateAction(conversation, action)) onChanged();
    } catch {
      setError("Could not update this chat. Try again.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {conversationStateActions(conversation).map(({ action, label, danger }) => {
        const Icon = action === "archive" ? Archive : action === "unarchive" ? ArchiveRestore : action === "block" ? Ban : Undo2;
        return (
          <button
            key={action}
            type="button"
            onClick={() => handle(action)}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors cursor-pointer ${
              danger ? "border-rose-200 text-rose-700 hover:bg-rose-50" : "border-[#E3EBCE] text-[#25431D] hover:bg-[#F6F8ED]"
            }`}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </button>
        );
      })}
      {error ? <p className="w-full text-xs text-rose-700">{error}</p> : null}
    </div>
  );
}
