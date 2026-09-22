import React from "react";
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
import { MessageCircle } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../src/theme";
import { useSellerMessages } from "../../src/features/messages/hooks/useSellerMessages";
import { MessageCard } from "../../src/features/messages/components/MessageCard";
import type { SellerMessageFilter } from "../../src/features/messages/types";

const filters: { id: SellerMessageFilter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "all", label: "All" },
];

export default function SellerMessagesScreen() {
  const router = useRouter();
  const { filter, setFilter, messages, openCount, loading, refreshing, loadingMore, error, refresh, loadMore } = useSellerMessages();

  if (loading && !refreshing) {
    return <SafeAreaView style={styles.safeArea} edges={["bottom"]}><View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.muted}>Loading messages...</Text></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />}
        ListHeaderComponent={<View style={styles.header}>
          <View style={styles.titleRow}><View><Text style={styles.title}>Messages</Text><Text style={styles.subtitle}>{openCount} open message{openCount === 1 ? "" : "s"}</Text></View><MessageCircle size={26} color={colors.primary} /></View>
          <View style={styles.filterRow}>{filters.map((item) => <Pressable key={item.id} onPress={() => setFilter(item.id)} accessibilityRole="tab" accessibilityState={{ selected: filter === item.id }} style={[styles.filter, filter === item.id && styles.filterSelected]}><Text style={[styles.filterText, filter === item.id && styles.filterTextSelected]}>{item.label}</Text></Pressable>)}</View>
          {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text><ButtonComponent title="Try Again" onPress={refresh} variant="secondary" style={styles.retry} /></View> : null}
        </View>}
        renderItem={({ item }) => <MessageCard message={item} onPress={() => router.push({ pathname: "/(app)/orders/[id]", params: { id: item.orderId } })} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.primary} /> : null}
        ListEmptyComponent={<View style={styles.empty}><MessageCircle size={30} color={colors.primary} /><Text style={styles.emptyTitle}>{filter === "open" ? "No open messages" : "No messages yet"}</Text><Text style={styles.muted}>Buyer questions will appear here.</Text></View>}
      />
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
  filterRow: { flexDirection: "row", gap: spacing.sm },
  filter: { minHeight: 40, paddingHorizontal: spacing.lg, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
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
