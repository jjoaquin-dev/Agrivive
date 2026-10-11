"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, isAbortError } from "@/src/lib/api";
import {
  conversationWebSocketUrl,
  createConversation,
  listConversationMessages,
  listConversations,
  markConversationRead,
  sendConversationMessage,
  type Conversation,
  type ConversationContext,
  type ConversationMessage,
} from "../api";

function newClientMessageId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useConversationThread(contextType: ConversationContext, contextId: string, refreshKey = 0, conversationId?: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [requiresAuth, setRequiresAuth] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError("");
    try {
      const conversations = await listConversations(signal);
      const match = conversations.find((item) => conversationId
        ? item.id === conversationId
        : item.contextType === contextType && (
          contextType === "product"
            ? item.productId === contextId
            : contextType === "seller"
              ? item.sellerId === contextId
              : item.orderId === contextId
        )) ?? null;
      setConversation(match);
      if (match) {
        const history = await listConversationMessages(match.id, signal);
        setMessages(history);
        await markConversationRead(match.id);
      } else {
        setMessages([]);
      }
      setRequiresAuth(false);
    } catch (reason) {
      if (isAbortError(reason)) return;
      if (reason instanceof ApiError && (reason.status === 401 || reason.status === 403)) {
        setRequiresAuth(true);
        return;
      }
      setError(reason instanceof ApiError ? reason.message : "We could not load this conversation.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [contextId, contextType, conversationId]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load, refreshKey]);

  useEffect(() => {
    if (!conversation) return;
    const socket = new WebSocket(conversationWebSocketUrl(conversation.id));
    socketRef.current = socket;
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { type?: string; message?: ConversationMessage };
        if (payload.type !== "conversation.message.created" || !payload.message) return;
        setMessages((current) => current.some((item) => item.id === payload.message!.id)
          ? current
          : [...current, payload.message!]);
        void markConversationRead(conversation.id);
      } catch {
        // Ignore malformed socket frames and recover through the REST history request.
      }
    };
    socket.onerror = () => setError("Live messages are unavailable. You can still refresh the conversation.");
    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [conversation]);

  const send = useCallback(async (text: string) => {
    const body = text.trim();
    if (!body || sending) return false;
    setSending(true);
    setError("");
    try {
      let result: ConversationResult;
      if (!conversation) {
        result = await createConversation({
          contextType,
          ...(contextType === "product"
            ? { productId: contextId }
            : contextType === "seller"
              ? { sellerId: contextId }
              : { orderId: contextId }),
          message: body,
          clientMessageId: newClientMessageId(),
        });
        setConversation(result.conversation);
        setMessages([result.message]);
      } else {
        const message = await sendConversationMessage(conversation.id, body, newClientMessageId());
        setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
      }
      setRequiresAuth(false);
      return true;
    } catch (reason) {
      if (reason instanceof ApiError && (reason.status === 401 || reason.status === 403)) setRequiresAuth(true);
      else setError(reason instanceof ApiError ? reason.message : "We could not send the message.");
      return false;
    } finally {
      setSending(false);
    }
  }, [contextId, contextType, conversation, sending]);

  return useMemo(() => ({ conversation, messages, loading, sending, error, requiresAuth, send, reload: load }), [
    conversation, messages, loading, sending, error, requiresAuth, send, load,
  ]);
}

type ConversationResult = { conversation: Conversation; message: ConversationMessage };
