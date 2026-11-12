"use client";

import { useState } from "react";
import { Archive, ArchiveRestore, Ban, Undo2 } from "lucide-react";
import { ConfirmationModalComponent } from "@/src/components/ConfirmationModalComponent";
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

/** Runs archive, unarchive and unblock at once. Blocking asks first in a confirmation dialog. */
export function useConversationState(item: Conversation, onDone: () => void, onFail?: () => void) {
  const [confirming, setConfirming] = useState(false);

  async function run(action: ConversationStateAction) {
    try {
      await setConversationState(item.id, action);
      onDone();
    } catch {
      onFail?.();
    }
  }

  const request = (action: ConversationStateAction) => {
    if (action === "block") setConfirming(true);
    else void run(action);
  };

  const dialog = (
    <ConfirmationModalComponent
      open={confirming}
      onClose={() => setConfirming(false)}
      onConfirm={async () => { setConfirming(false); await run("block"); }}
      title="Block this seller?"
      description="You will not get or send messages in this chat."
      confirmLabel="Block"
      cancelLabel="Keep chat"
      variant="destructive"
    />
  );

  return { request, dialog };
}

/** Archive and block buttons for the thread header and seller info panel. */
export function ConversationStateButtons({ conversation, onChanged }: { conversation: Conversation; onChanged: () => void }) {
  const [error, setError] = useState("");

  const { request, dialog } = useConversationState(conversation, onChanged, () => setError("Could not update this chat. Try again."));

  function handle(action: ConversationStateAction) {
    setError("");
    request(action);
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {conversationStateActions(conversation).map(({ action, label, danger }) => {
        const Icon = action === "archive" ? Archive : action === "unarchive" ? ArchiveRestore : action === "block" ? Ban : Undo2;
        return (
          <button
            key={action}
            type="button"
            onClick={() => handle(action)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border bg-white py-2.5 text-xs font-bold shadow-sm transition-colors cursor-pointer ${
              danger ? "border-rose-200 text-destructive hover:bg-rose-600 hover:text-white" : "border-neutral-200 text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </button>
        );
      })}
      {error ? <p className="w-full text-xs text-destructive" role="alert">{error}</p> : null}
      {dialog}
    </div>
  );
}
