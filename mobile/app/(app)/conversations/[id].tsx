import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Paperclip, Send, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { fetchConversationMessages, fetchConversations, markConversationRead, sendConversationMessage, uploadConversationAttachment } from "../../../src/features/conversations/api";
import { ConversationBubble } from "../../../src/features/conversations/components/ConversationBubble";
import { ConversationContextBanner } from "../../../src/features/conversations/components/ConversationContextBanner";
import { ConversationReservationCard } from "../../../src/features/conversations/components/ConversationReservationCard";
import { ConversationQuickReplies } from "../../../src/features/conversations/components/ConversationQuickReplies";
import { ConversationHeaderBar } from "../../../src/features/conversations/components/ConversationHeaderBar";
import type { Conversation, ConversationMessage } from "../../../src/features/conversations/types";
import { radii, spacing } from "../../../src/theme";
import { getAvatarColor, getInitials } from "../../../src/features/conversations/utils/avatar";
import { useConversationSocket } from "../../../src/features/conversations/hooks/useConversationSocket";

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
    setMessages((current) => (current.some((item) => item.id === message.id) ? current : [...current, message]));
  }, []);

  useEffect(() => {
    if (!id) return;
    let active = true;
    void Promise.all([fetchConversations(), fetchConversationMessages(id)])
      .then(async ([convosRes, history]) => {
        if (!active) return;
        setConversation(convosRes.items.find((item) => item.id === id) ?? null);
        setMessages(history);
        await markConversationRead(id);
      })
      .catch((r: any) => { if (active) setError(r?.message || "Could not load conversation."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const { paused } = useConversationSocket(id, !loading, addMessage);

  const senderName = useMemo(() => conversation?.buyerName || "Buyer", [conversation]);
  const avatarBg = useMemo(() => getAvatarColor(senderName), [senderName]);
  const initials = useMemo(() => getInitials(senderName), [senderName]);

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

  async function send(customText?: string) {
    if (uploading || sending) return;
    let body = (customText ?? draft).trim();
    if (attachment) body = body ? `${body}\n${attachment.url}` : attachment.url;
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

  if (loading) return <SafeAreaView style={styles.safe}><View style={styles.center}><ActivityIndicator size="large" color="#16A34A" /><Text style={styles.muted}>Loading conversation...</Text></View></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ConversationHeaderBar senderName={senderName} avatarBg={avatarBg} initials={initials} />
        {conversation && <ConversationContextBanner conversation={conversation} />}

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messages}
          ListHeaderComponent={
            <View>
              <View style={styles.dateDivider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Today</Text>
                <View style={styles.dividerLine} />
              </View>
              {conversation?.orderId && (
                <ConversationReservationCard orderId={conversation.orderId} fallbackProductName={conversation.productName || undefined} />
              )}
            </View>
          }
          renderItem={({ item }) => (
            <ConversationBubble item={item} isMine={item.senderId === conversation?.sellerId} senderName={senderName} />
          )}
          ListEmptyComponent={<Text style={styles.muted}>No messages yet.</Text>}
        />

        <ConversationQuickReplies onSelect={(reply) => void send(reply)} shopName={conversation?.sellerShopName} />

        {attachment ? (
          <View style={styles.attachmentPill}>
            <Image source={{ uri: attachment.url }} style={styles.thumb} />
            <Text style={styles.attachmentName} numberOfLines={1}>{attachment.filename}</Text>
            <Pressable onPress={() => setAttachment(null)}><X size={16} color="#6B7280" /></Pressable>
          </View>
        ) : null}

        <View style={styles.composer}>
          {error || paused ? <Text style={styles.error}>{error || "Live messages paused. Reconnecting…"}</Text> : null}
          <Pressable onPress={handlePickImage} disabled={uploading || sending} style={styles.attachBtn}>
            <Paperclip size={18} color="#6B7280" />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={2000}
            editable={!sending}
            style={styles.input}
          />
          <Pressable
            onPress={() => void send()}
            disabled={sending || uploading || (!draft.trim() && !attachment)}
            style={[styles.sendBtn, (!draft.trim() && !attachment) && styles.sendBtnDisabled]}
          >
            <Send size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  messages: { padding: spacing.base, flexGrow: 1 },
  dateDivider: { flexDirection: "row", alignItems: "center", marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: { marginHorizontal: spacing.md, fontSize: 12, color: "#9CA3AF" },
  composer: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.base, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: "#F3F4F6", backgroundColor: "#FFFFFF" },
  attachBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#F3F4F6" },
  input: { flex: 1, minHeight: 40, maxHeight: 100, borderRadius: 20, backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", paddingHorizontal: spacing.md, paddingVertical: 8, fontSize: 14, color: "#111827" },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#16A34A" },
  sendBtnDisabled: { backgroundColor: "#E5E7EB" },
  attachmentPill: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginHorizontal: spacing.base, padding: spacing.xs, borderRadius: radii.button, backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB" },
  thumb: { width: 32, height: 32, borderRadius: 6 },
  attachmentName: { flex: 1, fontSize: 12, color: "#111827" },
  error: { position: "absolute", bottom: 62, left: spacing.base, right: spacing.base, color: "#DC2626", fontSize: 12 },
  muted: { fontSize: 13, color: "#9CA3AF", textAlign: "center", marginTop: spacing.md },
});
