import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Paperclip, Send, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { fetchConversationMessages, fetchConversations, markConversationRead, openConversationSocket, sendConversationMessage, uploadConversationAttachment } from "../../../src/features/conversations/api";
import { ConversationBubble } from "../../../src/features/conversations/components/ConversationBubble";
import type { Conversation, ConversationMessage } from "../../../src/features/conversations/types";
import { colors, fonts, radii, spacing } from "../../../src/theme";

export default function ConversationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<{ url: string; filename: string } | null>(null);
  const [uploading, setUploading] = useState(false);
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

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Photo library access is needed to share produce pictures.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (result.canceled || !result.assets?.[0]?.uri) return;

    setUploading(true);
    setError("");
    try {
      const uploaded = await uploadConversationAttachment(result.assets[0].uri);
      setAttachment(uploaded);
    } catch (err: any) {
      setError(err?.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  async function send() {
    if (uploading || sending) return;
    let body = draft.trim();
    if (attachment) {
      body = body ? `${body}\n${attachment.url}` : attachment.url;
    }
    if (!body || !id) return;
    setSending(true);
    setError("");
    try {
      const message = await sendConversationMessage(id, body, `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      addMessage(message);
      setDraft("");
      setAttachment(null);
    } catch (reason: any) {
      setError(reason?.message || "Could not send the message.");
    } finally {
      setSending(false);
    }
  }

  if (loading) return <SafeAreaView style={styles.safe}><View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.muted}>Loading conversation...</Text></View></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Live conversation with the buyer</Text>
        </View>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.messages}
          renderItem={({ item }) => (
            <ConversationBubble item={item} isMine={item.senderId === conversation?.sellerId} />
          )}
          ListEmptyComponent={<Text style={styles.muted}>No messages yet.</Text>}
        />
        {uploading ? (
          <View style={styles.stagingPill}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.stagingText}>Uploading image...</Text>
          </View>
        ) : null}
        {attachment && !uploading ? (
          <View style={styles.attachmentPill}>
            <Image source={{ uri: attachment.url }} style={styles.thumb} />
            <Text style={styles.attachmentName} numberOfLines={1}>{attachment.filename}</Text>
            <Pressable onPress={() => setAttachment(null)} style={styles.removeBtn}>
              <X size={16} color={colors.textMuted} />
            </Pressable>
          </View>
        ) : null}
        <View style={styles.composer}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable onPress={handlePickImage} disabled={uploading || sending} style={styles.attachBtn}>
            <Paperclip size={20} color={colors.primary} />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Write a message"
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={2000}
            editable={!sending}
            style={styles.input}
          />
          <Pressable onPress={() => void send()} disabled={sending || uploading || (!draft.trim() && !attachment)} style={[styles.send, (sending || uploading || (!draft.trim() && !attachment)) && styles.sendDisabled]}>
            <Send size={18} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { padding: spacing.base, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
  messages: { padding: spacing.base, gap: spacing.sm, flexGrow: 1 },
  composer: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm, padding: spacing.base, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  attachBtn: { width: 44, height: 46, borderRadius: radii.button, alignItems: "center", justifyContent: "center", backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, minHeight: 46, maxHeight: 120, borderWidth: 1, borderColor: colors.border, borderRadius: radii.button, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, color: colors.text, fontFamily: fonts.body.regular, fontSize: 15, backgroundColor: colors.background },
  send: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  sendDisabled: { opacity: 0.45 },
  stagingPill: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.base, paddingVertical: spacing.xs, backgroundColor: "rgba(31, 77, 58, 0.08)" },
  stagingText: { fontSize: 12, color: colors.primary, fontFamily: fonts.body.regular },
  attachmentPill: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginHorizontal: spacing.base, marginBottom: spacing.xs, padding: spacing.xs, borderRadius: radii.button, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  thumb: { width: 36, height: 36, borderRadius: radii.button },
  attachmentName: { flex: 1, fontSize: 12, color: colors.text, fontFamily: fonts.body.regular },
  removeBtn: { padding: spacing.xs },
  error: { position: "absolute", bottom: 78, left: spacing.base, right: spacing.base, color: colors.error, fontFamily: fonts.body.regular, fontSize: 12 },
  muted: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
});
