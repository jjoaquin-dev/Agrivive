import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConversationBubble } from "../../../src/features/conversations/components/ConversationBubble";
import { ConversationContextBanner } from "../../../src/features/conversations/components/ConversationContextBanner";
import { ConversationReservationCard } from "../../../src/features/conversations/components/ConversationReservationCard";
import { ConversationOrderEvent } from "../../../src/features/conversations/components/ConversationOrderEvent";
import { ConversationQuickReplies } from "../../../src/features/conversations/components/ConversationQuickReplies";
import { ConversationHeaderBar } from "../../../src/features/conversations/components/ConversationHeaderBar";
import { ConversationComposer } from "../../../src/features/conversations/components/ConversationComposer";
import { ConversationDateDivider } from "../../../src/features/conversations/components/ConversationDateDivider";
import { ConversationFailedBubble } from "../../../src/features/conversations/components/ConversationFailedBubble";
import { ConversationPhotoViewer } from "../../../src/features/conversations/components/ConversationPhotoViewer";
import { ConversationReconnectBanner } from "../../../src/features/conversations/components/ConversationReconnectBanner";
import { useConversationDetail } from "../../../src/features/conversations/hooks/useConversationDetail";
import { useConversationOrder } from "../../../src/features/conversations/hooks/useConversationOrder";
import { useConversationProduct } from "../../../src/features/conversations/hooks/useConversationProduct";
import { colors, fonts, spacing } from "../../../src/theme";
import { getAvatarColor, getInitials } from "../../../src/features/conversations/utils/avatar";
import { formatDay, formatDayAndClock, orderRef, peso, unitShort } from "../../../src/features/conversations/utils/chatFormat";

const closedReasons = {
  completed: "The order has been completed. You cannot send more messages.",
  cancelled: "The order was cancelled. You cannot send more messages.",
  expired: "The order has expired. You cannot send more messages.",
} as const;

export default function ConversationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const inputRef = useRef<TextInput | null>(null);
  const listRef = useRef<FlatList | null>(null);
  const [viewer, setViewer] = useState<{ url: string; sentAt: string } | null>(null);

  const chat = useConversationDetail(id);
  const { conversation, messages, loading, failed } = chat;
  const { order } = useConversationOrder(conversation?.orderId);
  const product = useConversationProduct(conversation?.orderId ? null : conversation?.productId);

  // Open at the newest message, and follow new ones.
  useEffect(() => {
    const timer = setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 50);
    return () => clearTimeout(timer);
  }, [messages.length, failed, order?.status, loading]);

  const senderName = conversation?.buyerName || "Buyer";
  const avatarBg = useMemo(() => getAvatarColor(senderName), [senderName]);
  const initials = useMemo(() => getInitials(senderName), [senderName]);
  const isClosed = conversation?.status === "closed";
  const orderStatus = order?.status;
  const closedReason = orderStatus && orderStatus !== "pending" ? closedReasons[orderStatus] : "You cannot send more messages.";

  const subtitle = conversation?.orderId
    ? `Order #${orderRef(conversation.orderId)}${isClosed && orderStatus === "completed" ? " • Completed" : ""}`
    : conversation?.productName ? `Listing: ${conversation.productName}` : null;
  const openDetails = conversation?.orderId
    ? () => router.push({ pathname: "/(app)/orders/[id]", params: { id: conversation.orderId as string } })
    : conversation?.productId
      ? () => router.push({ pathname: "/(app)/inventory/[id]", params: { id: conversation.productId as string } })
      : undefined;

  const listingLine = product
    ? `From listing: ${product.productName} (${peso(product.productPrice)}/${unitShort(product.scalingType, 1)}) • ${Number(product.productQty ?? 0)} ${unitShort(product.scalingType, Number(product.productQty ?? 0))} available`
    : null;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Stack.Screen options={{ headerShown: false }} />
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
        <ConversationHeaderBar senderName={senderName} subtitle={subtitle} avatarBg={avatarBg} initials={initials} buyerImage={conversation?.buyerImage} onInfo={openDetails} />
        {conversation ? <ConversationContextBanner conversation={conversation} order={order} product={product} onPress={openDetails} /> : null}
        {chat.paused ? <ConversationReconnectBanner /> : null}

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.thread}
          contentContainerStyle={styles.messages}
          ListFooterComponent={
            <View>
              {conversation?.orderId ? <ConversationReservationCard order={order} orderId={conversation.orderId} /> : null}
              <ConversationOrderEvent order={order} />
              {failed ? <ConversationFailedBubble body={failed.body} message={failed.message} busy={chat.sending} onRetry={chat.retrySend} /> : null}
            </View>
          }
          renderItem={({ item, index }) => {
            const prev = index > 0 ? messages[index - 1] : null;
            const day = formatDay(item.createdAt);
            const showDivider = !prev || formatDay(prev.createdAt) !== day;
            const isMine = item.senderId === conversation?.sellerId;
            const isFirst = !prev || prev.senderId !== item.senderId || showDivider;
            const lastMine = isMine && !messages.slice(index + 1).some((m) => m.senderId === conversation?.sellerId);
            return (
              <View>
                {showDivider ? <ConversationDateDivider label={day} /> : null}
                <ConversationBubble
                  item={item}
                  isMine={isMine}
                  senderName={senderName}
                  buyerImage={conversation?.buyerImage}
                  isFirstInGroup={isFirst}
                  showSent={lastMine && !failed}
                  onOpenPhoto={(url) => setViewer({ url, sentAt: item.createdAt })}
                />
              </View>
            );
          }}
          ListEmptyComponent={<Text style={styles.muted}>{chat.loadError || "No messages yet."}</Text>}
        />

        {!isClosed ? <ConversationQuickReplies onSelect={(text) => { chat.setDraft(text); inputRef.current?.focus(); }} shopName={conversation?.sellerShopName} /> : null}
        {chat.uploadError ? <Text style={styles.uploadError}>{chat.uploadError}</Text> : null}

        <ConversationComposer
          isClosed={Boolean(isClosed)}
          closedReason={closedReason}
          draft={chat.draft}
          onChangeDraft={chat.setDraft}
          inputRef={inputRef}
          photo={chat.photo}
          photoReady={chat.photoReady}
          onRemovePhoto={chat.removePhoto}
          uploading={chat.uploading}
          sending={chat.sending}
          onPickImage={chat.pickImage}
          onSend={chat.send}
        />
      </KeyboardAvoidingView>

      <ConversationPhotoViewer
        visible={viewer !== null}
        imageUrl={viewer?.url ?? null}
        senderName={senderName}
        avatarBg={avatarBg}
        initials={initials}
        buyerImage={conversation?.buyerImage}
        sentAtLabel={viewer ? formatDayAndClock(viewer.sentAt) : ""}
        listingName={conversation?.productName}
        listingLine={listingLine}
        onClose={() => setViewer(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  thread: { backgroundColor: colors.surfaceMuted },
  messages: { padding: spacing.base, flexGrow: 1 },
  uploadError: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.error, paddingHorizontal: spacing.base, paddingTop: spacing.xs, backgroundColor: colors.surface },
  muted: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, textAlign: "center", marginTop: spacing.md },
});
