import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MessageCircle, Globe } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../src/theme";
import { useSellerConversations } from "../../src/features/conversations/hooks/useSellerConversations";
import { useSellerProductInquiries } from "../../src/features/messages/hooks/useSellerProductInquiries";
import { ConversationListItem } from "../../src/features/conversations/components/ConversationListItem";
import { ProductInquiryCard } from "../../src/features/messages/components/ProductInquiryCard";

export default function SellerMessagesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"direct" | "website">("direct");
  const direct = useSellerConversations();
  const web = useSellerProductInquiries();

  const totalDirectUnread = direct.conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const openWebCount = web.inquiries.filter((i) => !i.reply).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>Direct buyer chats and website questions</Text>
          </View>
          <View style={styles.iconCircle}>
            <MessageCircle size={22} color={colors.primary} />
          </View>
        </View>

        {/* Messenger Category Tabs */}
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => setActiveTab("direct")}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === "direct" }}
            style={[styles.tabButton, activeTab === "direct" && styles.tabButtonActive]}
          >
            <MessageCircle size={16} color={activeTab === "direct" ? colors.white : colors.textMuted} />
            <Text style={[styles.tabText, activeTab === "direct" && styles.tabTextActive]}>
              Direct Chats
            </Text>
            {totalDirectUnread > 0 && (
              <View style={[styles.tabBadge, activeTab === "direct" && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, activeTab === "direct" && styles.tabBadgeTextActive]}>
                  {totalDirectUnread}
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("website")}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === "website" }}
            style={[styles.tabButton, activeTab === "website" && styles.tabButtonActive]}
          >
            <Globe size={16} color={activeTab === "website" ? colors.white : colors.textMuted} />
            <Text style={[styles.tabText, activeTab === "website" && styles.tabTextActive]}>
              Web Inquiries
            </Text>
            {openWebCount > 0 && (
              <View style={[styles.tabBadge, activeTab === "website" && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, activeTab === "website" && styles.tabBadgeTextActive]}>
                  {openWebCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Direct Conversations Tab */}
      {activeTab === "direct" && (
        <FlatList
          data={direct.conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={direct.refreshing}
              onRefresh={direct.refresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <ConversationListItem
              conversation={item}
              onPress={() =>
                router.push({
                  pathname: "/(app)/conversations/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
          ListEmptyComponent={
            direct.loading ? (
              <ActivityIndicator color={colors.primary} style={styles.loader} />
            ) : (
              <View style={styles.empty}>
                <MessageCircle size={32} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>No direct chats yet</Text>
                <Text style={styles.muted}>Messages from buyers on your orders will appear here.</Text>
              </View>
            )
          }
        />
      )}

      {/* Website Inquiries & Feedback Tab */}
      {activeTab === "website" && (
        <FlatList
          data={web.inquiries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={web.refreshing}
              onRefresh={web.refresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <View style={styles.subFilterRow}>
              <Pressable
                onPress={() => web.setFilter("open")}
                style={[styles.subFilterChip, web.filter === "open" && styles.subFilterChipActive]}
              >
                <Text style={[styles.subFilterText, web.filter === "open" && styles.subFilterTextActive]}>
                  Waiting for reply
                </Text>
              </Pressable>
              <Pressable
                onPress={() => web.setFilter("all")}
                style={[styles.subFilterChip, web.filter === "all" && styles.subFilterChipActive]}
              >
                <Text style={[styles.subFilterText, web.filter === "all" && styles.subFilterTextActive]}>
                  All questions
                </Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <ProductInquiryCard
              inquiry={item}
              onReply={web.reply}
              isReplying={web.replyingId === item.id}
            />
          )}
          ListEmptyComponent={
            web.loading ? (
              <ActivityIndicator color={colors.primary} style={styles.loader} />
            ) : (
              <View style={styles.empty}>
                <Globe size={32} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>No website inquiries</Text>
                <Text style={styles.muted}>Customer questions from the marketplace will appear here.</Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.base, paddingTop: spacing.base, paddingBottom: spacing.sm },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  title: { fontFamily: fonts.heading.bold, fontSize: 26, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(31, 77, 58, 0.08)", alignItems: "center", justifyContent: "center" },
  tabContainer: { flexDirection: "row", backgroundColor: "rgba(0,0,0,0.04)", borderRadius: radii.full, padding: 4, gap: 4 },
  tabButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, minHeight: touchTargets.min, borderRadius: radii.full, paddingHorizontal: spacing.sm },
  tabButtonActive: { backgroundColor: colors.primary },
  tabText: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.textMuted },
  tabTextActive: { color: colors.white, fontFamily: fonts.body.semiBold },
  tabBadge: { backgroundColor: "rgba(0,0,0,0.08)", borderRadius: radii.full, paddingHorizontal: 6, paddingVertical: 1 },
  tabBadgeActive: { backgroundColor: colors.white },
  tabBadgeText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.text },
  tabBadgeTextActive: { color: colors.primary },
  listContent: { paddingHorizontal: spacing.base, paddingBottom: spacing.xxxl },
  subFilterRow: { flexDirection: "row", gap: spacing.xs, marginBottom: spacing.sm },
  subFilterChip: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  subFilterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  subFilterText: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.textMuted },
  subFilterTextActive: { color: colors.white, fontFamily: fonts.body.semiBold },
  loader: { marginVertical: spacing.xl },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text, marginTop: spacing.md },
  muted: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs, paddingHorizontal: spacing.xl },
});
