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
import { MessageCircle, Package } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../src/theme";
import { useSellerMessages } from "../../src/features/messages/hooks/useSellerMessages";
import { useSellerProductInquiries } from "../../src/features/messages/hooks/useSellerProductInquiries";
import { MessageCard } from "../../src/features/messages/components/MessageCard";
import { ProductInquiryCard } from "../../src/features/messages/components/ProductInquiryCard";
import type { SellerMessageFilter } from "../../src/features/messages/types";

type InboxSection = "orders" | "products";

const filters: { id: SellerMessageFilter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "all", label: "All" },
];

export default function SellerMessagesScreen() {
  const router = useRouter();
  const [section, setSection] = useState<InboxSection>("products");

  // Order Inquiries
  const orderHook = useSellerMessages();
  // Product Inquiries
  const productHook = useSellerProductInquiries();

  const isProducts = section === "products";
  const activeHook = isProducts ? productHook : orderHook;

  if (activeHook.loading && !activeHook.refreshing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.muted}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      {isProducts ? (
        <FlatList
          data={productHook.inquiries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={productHook.refreshing}
              onRefresh={productHook.refresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <View>
                  <Text style={styles.title}>Messages</Text>
                  <Text style={styles.subtitle}>Buyer inquiries and questions</Text>
                </View>
                <MessageCircle size={26} color={colors.primary} />
              </View>

              {/* Segmented Section Switcher */}
              <View style={styles.sectionTabs}>
                <Pressable
                  onPress={() => setSection("products")}
                  style={[styles.sectionTab, isProducts && styles.sectionTabSelected]}
                >
                  <Package size={16} color={isProducts ? colors.primary : colors.textMuted} />
                  <Text style={[styles.sectionTabText, isProducts && styles.sectionTabTextSelected]}>
                    Listing Questions
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSection("orders")}
                  style={[styles.sectionTab, !isProducts && styles.sectionTabSelected]}
                >
                  <MessageCircle size={16} color={!isProducts ? colors.primary : colors.textMuted} />
                  <Text style={[styles.sectionTabText, !isProducts && styles.sectionTabTextSelected]}>
                    Order Messages
                  </Text>
                </Pressable>
              </View>

              {/* Status Filter Chips */}
              <View style={styles.filterRow}>
                {filters.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => productHook.setFilter(item.id)}
                    style={[styles.filter, productHook.filter === item.id && styles.filterSelected]}
                  >
                    <Text style={[styles.filterText, productHook.filter === item.id && styles.filterTextSelected]}>
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {productHook.error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{productHook.error}</Text>
                  <ButtonComponent title="Try Again" onPress={productHook.refresh} variant="secondary" style={styles.retry} />
                </View>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <ProductInquiryCard
              inquiry={item}
              onReply={productHook.reply}
              isReplying={productHook.replyingId === item.id}
            />
          )}
          onEndReached={productHook.loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={productHook.loadingMore ? <ActivityIndicator color={colors.primary} /> : null}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Package size={30} color={colors.primary} />
              <Text style={styles.emptyTitle}>
                {productHook.filter === "open" ? "No open questions" : "No listing questions yet"}
              </Text>
              <Text style={styles.muted}>Questions asked on your product listings will appear here.</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={orderHook.messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={orderHook.refreshing}
              onRefresh={orderHook.refresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <View>
                  <Text style={styles.title}>Messages</Text>
                  <Text style={styles.subtitle}>
                    {orderHook.openCount} open order message{orderHook.openCount === 1 ? "" : "s"}
                  </Text>
                </View>
                <MessageCircle size={26} color={colors.primary} />
              </View>

              {/* Segmented Section Switcher */}
              <View style={styles.sectionTabs}>
                <Pressable
                  onPress={() => setSection("products")}
                  style={[styles.sectionTab, isProducts && styles.sectionTabSelected]}
                >
                  <Package size={16} color={isProducts ? colors.primary : colors.textMuted} />
                  <Text style={[styles.sectionTabText, isProducts && styles.sectionTabTextSelected]}>
                    Listing Questions
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setSection("orders")}
                  style={[styles.sectionTab, !isProducts && styles.sectionTabSelected]}
                >
                  <MessageCircle size={16} color={!isProducts ? colors.primary : colors.textMuted} />
                  <Text style={[styles.sectionTabText, !isProducts && styles.sectionTabTextSelected]}>
                    Order Messages
                  </Text>
                </Pressable>
              </View>

              {/* Status Filter Chips */}
              <View style={styles.filterRow}>
                {filters.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => orderHook.setFilter(item.id)}
                    style={[styles.filter, orderHook.filter === item.id && styles.filterSelected]}
                  >
                    <Text style={[styles.filterText, orderHook.filter === item.id && styles.filterTextSelected]}>
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {orderHook.error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{orderHook.error}</Text>
                  <ButtonComponent title="Try Again" onPress={orderHook.refresh} variant="secondary" style={styles.retry} />
                </View>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <MessageCard
              message={item}
              onPress={() => router.push({ pathname: "/(app)/orders/[id]", params: { id: item.orderId } })}
            />
          )}
          onEndReached={orderHook.loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={orderHook.loadingMore ? <ActivityIndicator color={colors.primary} /> : null}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MessageCircle size={30} color={colors.primary} />
              <Text style={styles.emptyTitle}>
                {orderHook.filter === "open" ? "No open messages" : "No messages yet"}
              </Text>
              <Text style={styles.muted}>Buyer order questions will appear here.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xxxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { marginBottom: spacing.base },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.base },
  title: { fontFamily: fonts.heading.bold, fontSize: 28, lineHeight: 34, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  sectionTabs: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
    marginBottom: spacing.base,
  },
  sectionTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 38,
    borderRadius: radii.button - 2,
  },
  sectionTabSelected: {
    backgroundColor: "rgba(31, 77, 58, 0.1)",
  },
  sectionTabText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  sectionTabTextSelected: {
    color: colors.primary,
    fontFamily: fonts.body.semiBold,
  },
  filterRow: { flexDirection: "row", gap: spacing.sm },
  filter: { minHeight: 38, paddingHorizontal: spacing.lg, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  filterSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontFamily: fonts.body.medium, fontSize: 14, color: colors.text },
  filterTextSelected: { color: colors.white, fontFamily: fonts.body.semiBold },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginTop: spacing.base },
  errorText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.error },
  retry: { marginTop: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl },
  emptyTitle: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text, marginTop: spacing.md },
  muted: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
});
