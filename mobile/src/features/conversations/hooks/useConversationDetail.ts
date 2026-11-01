import { useCallback, useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  fetchConversation,
  fetchConversationMessages,
  markConversationRead,
  sendConversationMessage,
  uploadConversationAttachment,
} from "../api";
import { useConversationSocket } from "./useConversationSocket";
import type { Conversation, ConversationMessage } from "../types";

/** A message that did not go out. It keeps its id, so sending it again can never post it twice. */
export type FailedMessage = { body: string; clientMessageId: string; message: string };

export function useConversationDetail(id?: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [photo, setPhoto] = useState<{ uri: string; filename: string } | null>(null);
  const [attachment, setAttachment] = useState<{ url: string; filename: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState<FailedMessage | null>(null);
  const uploadAbort = useRef<AbortController | null>(null);

  const addMessage = useCallback((m: ConversationMessage) => {
    setMessages((curr) => (curr.some((i) => i.id === m.id) ? curr : [...curr, m]));
  }, []);

  useEffect(() => {
    if (!id) return;
    let active = true;
    Promise.all([fetchConversation(id), fetchConversationMessages(id)])
      .then(([c, hist]) => {
        if (!active) return;
        setConversation(c);
        setMessages(hist);
        void markConversationRead(id);
      })
      .catch((err: any) => {
        if (active) setLoadError(err?.message || "Could not load conversation.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const { paused } = useConversationSocket(id, !loading, addMessage);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    const asset = res.assets?.[0];
    if (res.canceled || !asset?.uri) return;
    const controller = new AbortController();
    uploadAbort.current = controller;
    setPhoto({ uri: asset.uri, filename: asset.fileName || asset.uri.split("/").pop() || "photo.jpg" });
    setAttachment(null);
    setUploading(true);
    setUploadError(null);
    try {
      setAttachment(await uploadConversationAttachment(asset.uri, controller.signal));
    } catch (err: any) {
      if (!controller.signal.aborted) {
        setPhoto(null);
        setUploadError(err?.message || "Failed to upload photo.");
      }
    } finally {
      if (uploadAbort.current === controller) uploadAbort.current = null;
      setUploading(false);
    }
  };

  /** Cancels a photo that is still uploading, or removes one that is ready. */
  const removePhoto = () => {
    uploadAbort.current?.abort();
    uploadAbort.current = null;
    setPhoto(null);
    setAttachment(null);
    setUploading(false);
  };

  const execute = async (body: string, clientMessageId: string) => {
    if (!id) return;
    setSending(true);
    try {
      addMessage(await sendConversationMessage(id, body, clientMessageId));
      setFailed(null);
    } catch (err: any) {
      setFailed({ body, clientMessageId, message: err?.message || "Could not send message." });
    } finally {
      setSending(false);
    }
  };

  const send = () => {
    let body = draft.trim();
    if (attachment) body = body ? `${body}\n${attachment.url}` : attachment.url;
    if (!body) return;
    setDraft("");
    setPhoto(null);
    setAttachment(null);
    setUploadError(null);
    void execute(body, `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  };

  const retrySend = () => {
    if (failed) void execute(failed.body, failed.clientMessageId);
  };

  return {
    conversation,
    messages,
    loading,
    loadError,
    paused,
    draft,
    setDraft,
    photo,
    photoReady: attachment !== null,
    removePhoto,
    uploading,
    uploadError,
    sending,
    failed,
    pickImage,
    send,
    retrySend,
  };
}
