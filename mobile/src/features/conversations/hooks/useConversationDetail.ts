import { useCallback, useEffect, useState } from "react";
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

export function useConversationDetail(id?: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<{ url: string; filename: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [failedPayload, setFailedPayload] = useState<{ body: string; id: string } | null>(null);

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
        if (active) setSendError(err?.message || "Could not load conversation.");
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
    if (res.canceled || !res.assets?.[0]?.uri) return;
    setUploading(true);
    setSendError(null);
    try {
      const up = await uploadConversationAttachment(res.assets[0].uri);
      setAttachment(up);
    } catch (err: any) {
      setSendError(err?.message || "Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const executeSend = async (body: string, clientMsgId: string) => {
    if (!id) return;
    setSending(true);
    setSendError(null);
    try {
      const sent = await sendConversationMessage(id, body, clientMsgId);
      addMessage(sent);
      setDraft("");
      setAttachment(null);
      setFailedPayload(null);
    } catch (err: any) {
      setSendError(err?.message || "Could not send message.");
      setFailedPayload({ body, id: clientMsgId });
    } finally {
      setSending(false);
    }
  };

  const send = () => {
    let body = draft.trim();
    if (attachment) body = body ? `${body}\n${attachment.url}` : attachment.url;
    if (!body) return;
    const clientMsgId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    void executeSend(body, clientMsgId);
  };

  const retrySend = () => {
    if (!failedPayload) return;
    void executeSend(failedPayload.body, failedPayload.id);
  };

  return {
    conversation,
    messages,
    loading,
    paused,
    draft,
    setDraft,
    attachment,
    setAttachment,
    uploading,
    sending,
    sendError,
    pickImage,
    send,
    retrySend,
  };
}
