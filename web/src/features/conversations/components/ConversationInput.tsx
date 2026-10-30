"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { Image as ImageIcon, Link2, Loader2, Send, Smile, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
      <div className="border-t border-[#ECEEE2] bg-[#FAF9F3] p-4 text-center">
        <p className="text-xs text-[#7A8875]">Sign in to chat with this vendor.</p>
        <Link
          href="/login?next=%2Fmessages"
          className="mt-2 inline-flex h-9 items-center rounded-xl bg-[#386600] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#2F5400]"
        >
          Sign in to message
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 pt-1">
      {error || uploadError ? (
        <Alert variant="destructive" className="mb-2 text-xs">
          <AlertDescription>{error || uploadError}</AlertDescription>
        </Alert>
      ) : null}

      {uploading && (
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-[#EEF5E3] px-3 py-1.5 text-xs text-[#386600]">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Uploading attachment...</span>
        </div>
      )}

      {attachment && !uploading && (
        <div className="mb-2 flex items-center justify-between rounded-xl border border-[#ECEEE2] bg-[#FAF9F3] p-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <img src={attachment.url} alt="" className="size-8 rounded-lg object-cover" />
            <span className="truncate text-xs font-medium text-neutral-800">{attachment.filename}</span>
          </div>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="p-1 text-[#8A9685] hover:text-black"
            aria-label="Remove attachment"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSend}
        className="rounded-2xl border border-[#ECEEE2] bg-[#FAF9F3] p-3 shadow-2xs transition-colors focus-within:border-[#D5DACB]"
      >
        <textarea
          id="conversation-message-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          maxLength={2000}
          rows={2}
          disabled={sending}
          className="w-full resize-none rounded-xl border-[0.5px] border-[#DCDED5] bg-white px-3 py-2 text-xs text-[#202E1B] shadow-2xs outline-none transition-colors placeholder:text-[#6B736B] focus:border-[#C4C9BC] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
        />

        <div className="mt-2.5 flex items-center justify-between border-t border-[#ECEEE2]/80 pt-2">
          <div className="flex items-center gap-1.5 text-[#7A8875]">
            <button
              type="button"
              aria-label="Attach photo"
              onClick={() => fileInputRef.current?.click()}
              className="flex size-7 items-center justify-center rounded-lg hover:bg-white hover:text-[#202E1B] transition"
            >
              <ImageIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Insert emoji"
              onClick={() => setDraft((prev) => `${prev} 😊`)}
              className="flex size-7 items-center justify-center rounded-lg hover:bg-white hover:text-[#202E1B] transition"
            >
              <Smile className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Attach link"
              onClick={() => fileInputRef.current?.click()}
              className="flex size-7 items-center justify-center rounded-lg hover:bg-white hover:text-[#202E1B] transition"
            >
              <Link2 className="size-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={sending || uploading || (!draft.trim() && !attachment)}
            className="flex items-center gap-1.5 rounded-xl bg-[#386600] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#2E5400] active:scale-95 disabled:opacity-40"
          >
            <Send className="size-3" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
