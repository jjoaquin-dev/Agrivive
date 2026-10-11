import React from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MessageCircle, Package } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../src/theme";
import { useSellerConversations } from "../../src/features/conversations/hooks/useSellerConversations";
import type { Conversation } from "../../src/features/conversations/types";

export default function SellerMessagesScreen() {
  const router = useRouter();
  const inbox = useSellerConversations();

  if (inbox.loading) {
    return <SafeAreaView style={styles.safeArea} edges={["bottom"]}><View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.muted}>Loading conversations...</Text></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <FlatList
        data={inbox.conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={inbox.refreshing} onRefresh={inbox.refresh} colors={[colors.primary]} tintColor={colors.primary} />}
        ListHeaderComponent={<View style={styles.header}><View style={styles.titleRow}><View><Text style={styles.title}>Conversations</Text><Text style={styles.subtitle}>Live messages with buyers</Text></View><MessageCircle size={26} color={colors.primary} /></View>{inbox.error ? <View style={styles.errorBox}><Text style={styles.errorText}>{inbox.error}</Text><ButtonComponent title="Try Again" onPress={inbox.refresh} variant="secondary" style={styles.retry} /></View> : null}</View>}
        renderItem={({ item }) => <ConversationRow conversation={item} onPress={() => router.push({ pathname: "/(app)/conversations/[id]", params: { id: item.id } })} />}
        ListEmptyComponent={<View style={styles.empty}><MessageCircle size={30} color={colors.primary} /><Text style={styles.emptyTitle}>No conversations yet</Text><Text style={styles.muted}>Buyer messages about your listings and orders will appear here.</Text></View>}
      />
    </SafeAreaView>
  );
}

function ConversationRow({ conversation, onPress }: { conversation: Conversation; onPress: () => void }) {
  const title = conversation.contextType === "product" ? conversation.productName || "Listing conversation" : conversation.sellerShopName || conversation.sellerName || (conversation.contextType === "seller" ? "Seller conversation" : "Order conversation");
  const subtitle = conversation.contextType === "product" ? "Product listing" : conversation.contextType === "seller" ? "Seller conversation" : "Reservation order";
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}><View style={styles.iconBox}>{conversation.contextType === "product" ? <Package size={20} color={colors.primary} /> : <MessageCircle size={20} color={colors.primary} />}</View><View style={styles.rowBody}><View style={styles.rowTitle}><Text style={styles.rowHeading} numberOfLines={1}>{title}</Text>{conversation.unreadCount > 0 ? <View style={styles.badge}><Text style={styles.badgeText}>{conversation.unreadCount}</Text></View> : null}</View><Text style={styles.rowSubtitle}>{subtitle}</Text><Text numberOfLines={1} style={styles.rowSubtitle}>{conversation.lastMessageBody || "Start a conversation"}</Text><Text style={styles.date}>{new Date(conversation.lastMessageAt).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}</Text></View></Pressable>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xxxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { marginBottom: spacing.base },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.base },
  title: { fontFamily: fonts.heading.bold, fontSize: 28, lineHeight: 34, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, marginBottom: spacing.sm, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  rowPressed: { opacity: 0.75 },
  iconBox: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(31, 77, 58, 0.1)" },
  rowBody: { flex: 1 },
  rowTitle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  rowHeading: { flex: 1, fontFamily: fonts.body.semiBold, fontSize: 16, color: colors.text },
  rowSubtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 3 },
  date: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 6 },
  badge: { minWidth: 24, height: 24, paddingHorizontal: 6, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  badgeText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.white },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md },
  errorText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.error },
  retry: { marginTop: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text, marginTop: spacing.md },
  muted: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
});
