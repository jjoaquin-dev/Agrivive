import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send } from "lucide-react-native";
import { fetchConversationMessages, fetchConversations, markConversationRead, openConversationSocket, sendConversationMessage } from "../../../src/features/conversations/api";
import type { Conversation, ConversationMessage } from "../../../src/features/conversations/types";
import { colors, fonts, radii, spacing } from "../../../src/theme";

export default function ConversationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const addMessage = useCallback((message: ConversationMessage) => {
    setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
  }, []);

  useEffect(() => {
    if (!id) return;
    let active = true;
    let socket: WebSocket | null = null;
    void Promise.all([fetchConversations(), fetchConversationMessages(id)]).then(async ([items, history]) => {
      if (!active) return;
      setConversation(items.find((item) => item.id === id) ?? null);
      setMessages(history);
      await markConversationRead(id);
      socket = await openConversationSocket(id, addMessage, () => setError("Live messages are unavailable. Pull down to refresh."));
    }).catch((reason: any) => { if (active) setError(reason?.message || "Could not load this conversation."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; socket?.close(); };
  }, [addMessage, id]);

  const title = useMemo(() => conversation?.contextType === "product" ? conversation.productName || "Listing conversation" : conversation?.contextType === "seller" ? conversation.sellerShopName || conversation.sellerName || "Seller conversation" : "Order conversation", [conversation]);

  async function send() {
    const body = draft.trim();
    if (!body || !id || sending) return;
    setSending(true);
    setError("");
    try {
      const message = await sendConversationMessage(id, body, `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      addMessage(message);
      setDraft("");
    } catch (reason: any) {
      setError(reason?.message || "Could not send the message.");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <SafeAreaView style={styles.safe}><View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.muted}>Loading conversation...</Text></View></SafeAreaView>;

  return <SafeAreaView style={styles.safe} edges={["bottom"]}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}><View style={styles.header}><Text style={styles.title}>{title}</Text><Text style={styles.subtitle}>Live conversation with the buyer</Text></View><FlatList data={messages} keyExtractor={(item) => item.id} contentContainerStyle={styles.messages} renderItem={({ item }) => <View style={[styles.bubble, item.senderId === conversation?.sellerId ? styles.mine : styles.theirs]}><Text style={styles.sender}>{item.senderId === conversation?.sellerId ? "You" : "Buyer"}</Text><Text style={styles.body}>{item.body}</Text><Text style={styles.time}>{new Date(item.createdAt).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}</Text></View>} ListEmptyComponent={<Text style={styles.muted}>No messages yet.</Text>} /><View style={styles.composer}>{error ? <Text style={styles.error}>{error}</Text> : null}<TextInput value={draft} onChangeText={setDraft} placeholder="Write a message" placeholderTextColor={colors.textMuted} multiline maxLength={2000} editable={!sending} style={styles.input} /><Pressable onPress={() => void send()} disabled={sending || !draft.trim()} style={[styles.send, (sending || !draft.trim()) && styles.sendDisabled]}><Send size={18} color={colors.white} /></Pressable></View></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { padding: spacing.base, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
  messages: { padding: spacing.base, gap: spacing.sm, flexGrow: 1 },
  bubble: { maxWidth: "84%", padding: spacing.md, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border },
  mine: { alignSelf: "flex-end", backgroundColor: "rgba(31, 77, 58, 0.12)" },
  theirs: { alignSelf: "flex-start", backgroundColor: colors.surface },
  sender: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.primary },
  body: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 21, color: colors.text, marginTop: 4 },
  time: { fontFamily: fonts.body.regular, fontSize: 10, color: colors.textMuted, marginTop: 6 },
  composer: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm, padding: spacing.base, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, minHeight: 46, maxHeight: 120, borderWidth: 1, borderColor: colors.border, borderRadius: radii.button, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, color: colors.text, fontFamily: fonts.body.regular, fontSize: 15, backgroundColor: colors.background },
  send: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  sendDisabled: { opacity: 0.45 },
  error: { position: "absolute", bottom: 78, left: spacing.base, right: spacing.base, color: colors.error, fontFamily: fonts.body.regular, fontSize: 12 },
  muted: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
});
