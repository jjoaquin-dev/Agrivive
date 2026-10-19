"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { Loader2, Paperclip, Send, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { uploadConversationAttachment } from "../api";

export function ConversationInput({
  onSendMessage,
  sending,
  requiresAuth,
  error,
}: {
  onSendMessage: (content: string) => Promise<boolean>;
  sending: boolean;
  requiresAuth: boolean;
  error?: string | null;
}) {
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<{ url: string; filename: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploading) return;
    let content = draft.trim();
    if (attachment) {
      content = content ? `${content}\n${attachment.url}` : attachment.url;
    }
    if (!content) return;

    if (await onSendMessage(content)) {
      setDraft("");
      setAttachment(null);
      setUploadError(null);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  async function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    setUploading(true);
    setUploadError(null);
    try {
      const res = await uploadConversationAttachment(file);
      setAttachment(res);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setUploading(false);
    }
  }

  if (requiresAuth) {
    return (
      <div className="border-t border-border/70 bg-white p-4">
        <p className="text-sm text-muted-foreground">Sign in to message this seller.</p>
        <Link
          href="/login?next=%2Fmessages"
          className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white"
        >
          Sign in to message
        </Link>
      </div>
    );
  }

  return (
    <div className="border-t border-border/70 bg-white p-3 sm:p-4">
      {error || uploadError ? (
        <Alert variant="destructive" className="mb-3 text-xs">
          <AlertDescription>{error || uploadError}</AlertDescription>
        </Alert>
      ) : null}

      {uploading && (
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground animate-pulse">
          <Loader2 className="size-4 animate-spin text-agrivive-primary" />
          <span>Uploading attachment...</span>
        </div>
      )}

      {attachment && !uploading && (
        <div className="mb-2 flex items-center justify-between rounded-xl border border-border/80 bg-agrivive-background/60 p-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <img src={attachment.url} alt="Attachment preview" className="size-9 rounded-lg object-cover" />
            <span className="truncate text-xs font-medium text-foreground">{attachment.filename}</span>
          </div>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="p-1 text-muted-foreground hover:text-foreground"
            aria-label="Remove attachment"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="rounded-2xl border border-border/80 bg-white p-2.5 shadow-xs">
        <textarea
          id="conversation-message-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type message here..."
          maxLength={2000}
          rows={2}
          disabled={sending}
          className="w-full resize-none border-0 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
        />
        <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <button
              type="button"
              aria-label="Attach file"
              onClick={() => fileInputRef.current?.click()}
              className="flex size-8 items-center justify-center rounded-lg hover:bg-muted"
            >
              <Paperclip className="size-4" />
            </button>
          </div>
          <Button
            type="submit"
            disabled={sending || uploading || (!draft.trim() && !attachment)}
            className="gap-1.5 rounded-xl px-4 py-2 font-semibold"
          >
            <span>Send</span>
            <Send className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
