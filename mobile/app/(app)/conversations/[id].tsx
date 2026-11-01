import React, { useMemo, useRef } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConversationBubble } from "../../../src/features/conversations/components/ConversationBubble";
import { ConversationContextBanner } from "../../../src/features/conversations/components/ConversationContextBanner";
import { ConversationReservationCard } from "../../../src/features/conversations/components/ConversationReservationCard";
import { ConversationQuickReplies } from "../../../src/features/conversations/components/ConversationQuickReplies";
import { ConversationHeaderBar } from "../../../src/features/conversations/components/ConversationHeaderBar";
import { ConversationComposer } from "../../../src/features/conversations/components/ConversationComposer";
import { useConversationDetail } from "../../../src/features/conversations/hooks/useConversationDetail";
import { useConversationOrder } from "../../../src/features/conversations/hooks/useConversationOrder";
import { colors, fonts, spacing } from "../../../src/theme";
import { getAvatarColor, getInitials } from "../../../src/features/conversations/utils/avatar";

function formatDateDivider(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ConversationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const inputRef = useRef<TextInput | null>(null);

  const {
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
  } = useConversationDetail(id);

  const { order } = useConversationOrder(conversation?.orderId);

  const senderName = conversation?.buyerName || "Buyer";
  const avatarBg = useMemo(() => getAvatarColor(senderName), [senderName]);
  const initials = useMemo(() => getInitials(senderName), [senderName]);
  const isClosed = conversation?.status === "closed";

  const handleSelectQuickReply = (text: string) => {
    setDraft(text);
    inputRef.current?.focus();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.muted}>Loading chat…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ConversationHeaderBar
          senderName={senderName}
          avatarBg={avatarBg}
          initials={initials}
          buyerImage={conversation?.buyerImage}
        />
        {conversation ? <ConversationContextBanner conversation={conversation} order={order} /> : null}

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messages}
          ListHeaderComponent={
            conversation?.orderId ? (
              <ConversationReservationCard order={order} orderId={conversation.orderId} />
            ) : null
          }
          renderItem={({ item, index }) => {
            const prev = index > 0 ? messages[index - 1] : null;
            const next = index < messages.length - 1 ? messages[index + 1] : null;
            const currDate = formatDateDivider(item.createdAt);
            const prevDate = prev ? formatDateDivider(prev.createdAt) : null;
            const nextDate = next ? formatDateDivider(next.createdAt) : null;
            const showDivider = index === 0 || currDate !== prevDate;
            const isFirst = !prev || prev.senderId !== item.senderId || showDivider;
            const isLast = !next || next.senderId !== item.senderId || currDate !== nextDate;
            const isMine = item.senderId === conversation?.sellerId;
            return (
              <View>
                {showDivider ? (
                  <View style={styles.dateDivider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>{currDate}</Text>
                    <View style={styles.dividerLine} />
                  </View>
                ) : null}
                <ConversationBubble
                  item={item}
                  isMine={isMine}
                  senderName={senderName}
                  buyerImage={conversation?.buyerImage}
                  isFirstInGroup={isFirst}
                  isLastInGroup={isLast}
                  showSent={isMine && index === messages.length - 1}
                />
              </View>
            );
          }}
          ListEmptyComponent={<Text style={styles.muted}>No messages yet.</Text>}
        />

        {!isClosed ? (
          <ConversationQuickReplies
            onSelect={handleSelectQuickReply}
            shopName={conversation?.sellerShopName}
          />
        ) : null}

        <ConversationComposer
          isClosed={Boolean(isClosed)}
          draft={draft}
          onChangeDraft={setDraft}
          inputRef={inputRef}
          attachment={attachment}
          onRemoveAttachment={() => setAttachment(null)}
          uploading={uploading}
          sending={sending}
          onPickImage={pickImage}
          onSend={send}
          paused={paused}
          sendError={sendError}
          onRetrySend={retrySend}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  messages: { padding: spacing.base, flexGrow: 1 },
  dateDivider: { flexDirection: "row", alignItems: "center", marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { marginHorizontal: spacing.md, fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  muted: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, textAlign: "center", marginTop: spacing.md },
});
