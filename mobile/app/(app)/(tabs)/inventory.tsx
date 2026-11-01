import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList, RefreshControl, Pressable, ActivityIndicator, Modal, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, BookOpen, Archive } from "lucide-react-native";
import { useInventory } from "../../../src/features/inventory/hooks/useInventory";
import { ProductCard } from "../../../src/features/inventory/components/ProductCard";
import { InventoryListHeader } from "../../../src/features/inventory/components/InventoryListHeader";
import { InventoryEmptyState } from "../../../src/features/inventory/components/InventoryEmptyState";
import { CategorySheet } from "../../../src/features/inventory/components/CategorySheet";
import { PaginationControl } from "../../../src/components/PaginationControl";
import { colors, fonts, radii, shadows, spacing } from "../../../src/theme";

export default function InventoryScreen() {
  const router = useRouter();
  const {
    filteredProducts, summary, loading, refreshing, loadingMore, error,
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    filterTab, setFilterTab, refresh, loadMore,
  } = useInventory();

  const [menuVisible, setMenuVisible] = useState(false);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory, filterTab]);

  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => (
      <ProductCard
        product={item}
        onPress={() => router.push(`/(app)/inventory/${item.id}`)}
        onEdit={() => router.push(`/(app)/inventory/${item.id}/edit`)}
      />
    ),
    [router],
  );

  const menuItem = (label: string, Icon: typeof Archive, onPress: () => void) => (
    <Pressable onPress={() => { setMenuVisible(false); onPress(); }} style={styles.menuItem} accessibilityRole="button">
      <Icon size={16} color="#374151" />
      <Text style={styles.menuItemText}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <FlatList
        data={paginatedProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        removeClippedSubviews={Platform.OS === "android"}
        maxToRenderPerBatch={8}
        windowSize={5}
        initialNumToRender={6}
        ListHeaderComponent={
          <InventoryListHeader
            summary={summary}
            listingCount={filteredProducts.length}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            category={selectedCategory}
            onOpenCategory={() => setCategoryVisible(true)}
            filterTab={filterTab}
            onFilterTab={setFilterTab}
            onOpenNotifications={() => router.push("/(app)/notifications")}
            onOpenMenu={() => setMenuVisible(true)}
          />
        }
        ListEmptyComponent={
          <InventoryEmptyState
            loading={loading}
            error={error}
            searchQuery={searchQuery}
            filterTab={filterTab}
            onRetry={refresh}
            onClearSearch={() => setSearchQuery("")}
            onAdd={() => router.push("/(app)/inventory/create")}
          />
        }
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View>
            {loadingMore ? <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} /> : null}
            {filteredProducts.length > 0 ? (
              <PaginationControl
                currentPage={currentPage}
                totalItems={filteredProducts.length}
                pageSize={pageSize}
                pageSizeOptions={[5, 10, 20]}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                itemLabel="listings"
              />
            ) : null}
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />}
      />

      <Pressable
        onPress={() => router.push("/(app)/inventory/create")}
        accessibilityRole="button"
        accessibilityLabel="Add new produce"
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Plus size={28} color={colors.white} />
      </Pressable>

      <CategorySheet
        visible={categoryVisible}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        onClose={() => setCategoryVisible(false)}
      />

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuCard}>
            {menuItem("View Archived Listings", Archive, () => setFilterTab("archived"))}
            {menuItem("Listing Advisories & Help", BookOpen, () => router.push("/(app)/advisories"))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  listContent: { paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: 96 },
  fab: { position: "absolute", bottom: spacing.lg, right: spacing.lg, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", ...shadows.elevated },
  fabPressed: { backgroundColor: colors.primaryPressed, transform: [{ scale: 0.95 }] },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.25)", alignItems: "flex-end", paddingTop: 64, paddingRight: spacing.base },
  menuCard: { width: 240, backgroundColor: colors.surface, borderRadius: radii.card, paddingVertical: spacing.sm, borderWidth: 1, borderColor: colors.border, ...shadows.elevated },
  menuItem: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.base, minHeight: 48 },
  menuItemText: { fontFamily: fonts.body.medium, fontSize: 14, color: "#374151" },
});
