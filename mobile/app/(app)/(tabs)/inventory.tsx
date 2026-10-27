import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  TextInput,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Search,
  X,
  Plus,
  Package,
  Bell,
  MoreVertical,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
  Archive,
  TrendingUp,
} from "lucide-react-native";
import { useInventory, type InventoryFilterTab } from "../../../src/features/inventory/hooks/useInventory";
import { ProductCard } from "../../../src/features/inventory/components/ProductCard";
import { PaginationControl } from "../../../src/components/PaginationControl";
import { PRODUCT_CATEGORIES, type ProductCategory } from "../../../src/features/inventory/types";
import { colors, fonts, spacing } from "../../../src/theme";

export default function InventoryScreen() {
  const router = useRouter();
  const {
    filteredProducts,
    summary,
    loading,
    refreshing,
    loadingMore,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterTab,
    setFilterTab,
    refresh,
    loadMore,
  } = useInventory();

  const [menuVisible, setMenuVisible] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory, filterTab]);

  const paginatedProducts = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleClearSearch = () => setSearchQuery("");

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* Top Bar with Title, Subtitle, and Quick Actions */}
      <View style={styles.topBar}>
        <View style={styles.titleContainer}>
          <Text style={styles.screenTitle}>My Listings</Text>
          <Text style={styles.screenSubtitle}>Manage your surplus products</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={() => router.push("/(app)/notifications")}
            style={styles.iconButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Bell size={20} color="#374151" />
            <View style={styles.notificationDot} />
          </Pressable>

          <Pressable
            onPress={() => setMenuVisible(true)}
            style={styles.iconButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="More options"
          >
            <MoreVertical size={20} color="#374151" />
          </Pressable>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          placeholder="Search product name or category..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          returnKeyType="search"
        />
        {searchQuery.length > 0 ? (
          <Pressable
            onPress={handleClearSearch}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            style={styles.clearButton}
          >
            <X size={16} color="#9CA3AF" />
          </Pressable>
        ) : null}
      </View>

      {/* Status Filter Chips */}
      <View style={styles.chipRow}>
        {(
          [
            { id: "all", label: `All ${summary.totalProducts}` },
            { id: "low_stock", label: `Low Stock ${summary.lowStockCount}` },
            { id: "out_of_stock", label: `Out of Stock ${summary.outOfStockCount}` },
            { id: "archived", label: `Archived ${summary.archivedCount}` },
          ] as { id: InventoryFilterTab; label: string }[]
        ).map((tab) => {
          const isSelected = filterTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setFilterTab(tab.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              style={[styles.filterChip, isSelected && styles.filterChipSelected]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isSelected && styles.filterChipTextSelected,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Category Horizontal Filter Pills */}
      <View style={styles.categoryScrollContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={["all", ...PRODUCT_CATEGORIES] as (ProductCategory | "all")[]}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryRow}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <Pressable
                onPress={() => setSelectedCategory(item)}
                accessibilityRole="button"
                accessibilityLabel={item === "all" ? "All Categories" : item}
                style={[styles.categoryPill, isSelected && styles.categoryPillSelected]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextSelected,
                  ]}
                >
                  {item === "all" ? "All Categories" : item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Filter & Sort Summary Row */}
      <View style={styles.filterSortRow}>
        <View style={styles.filterGroup}>
          <Pressable
            onPress={() => {
              if (selectedCategory !== "all") setSelectedCategory("all");
              else if (filterTab !== "all") setFilterTab("all");
            }}
            style={styles.pillControl}
          >
            <SlidersHorizontal size={13} color="#374151" />
            <Text style={styles.pillControlText}>Filter</Text>
            {selectedCategory !== "all" || filterTab !== "all" ? (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>1</Text>
              </View>
            ) : null}
          </Pressable>

          <Pressable style={styles.pillControl}>
            <ArrowUpDown size={13} color="#374151" />
            <Text style={styles.pillControlText}>Sort</Text>
          </Pressable>
        </View>

        <Text style={styles.countText}>
          {filteredProducts.length} {filteredProducts.length === 1 ? "listing" : "listings"} · Newest First
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0F920F" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>Could not load products</Text>
          <Text style={styles.emptySub}>{error}</Text>
          <Pressable
            onPress={refresh}
            accessibilityRole="button"
            accessibilityLabel="Retry loading products"
            style={styles.primaryActionButton}
          >
            <Text style={styles.primaryActionButtonText}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    if (searchQuery.trim().length > 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>No matching products</Text>
          <Text style={styles.emptySub}>
            No products found matching "{searchQuery}".
          </Text>
          <Pressable
            onPress={handleClearSearch}
            accessibilityRole="button"
            accessibilityLabel="Clear search query"
            style={styles.primaryActionButton}
          >
            <Text style={styles.primaryActionButtonText}>Clear Search</Text>
          </Pressable>
        </View>
      );
    }

    if (filterTab === "low_stock") {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>✓ No Low Stock Items</Text>
          <Text style={styles.emptySub}>
            All active products currently have sufficient stock.
          </Text>
        </View>
      );
    }

    if (filterTab === "out_of_stock") {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>✓ No Out of Stock Items</Text>
          <Text style={styles.emptySub}>
            None of your listed products are currently out of stock.
          </Text>
        </View>
      );
    }

    if (filterTab === "archived") {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>No Archived Products</Text>
          <Text style={styles.emptySub}>
            Products you remove from active listings will appear here.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyIconCircle}>
          <Package size={36} color="#0F920F" />
        </View>
        <Text style={styles.emptyTitle}>Your inventory is empty</Text>
        <Text style={styles.emptySub}>
          Add your first vegetable surplus product to start managing inventory and receiving orders.
        </Text>
        <Pressable
          onPress={() => router.push("/(app)/inventory/create")}
          accessibilityRole="button"
          accessibilityLabel="Add your first product"
          style={styles.primaryActionButton}
        >
          <Plus size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.primaryActionButtonText}>Add Product</Text>
        </Pressable>
      </View>
    );
  };

  const renderItem = React.useCallback(
    ({ item }: { item: any }) => (
      <ProductCard
        product={item}
        onPress={() => router.push(`/(app)/inventory/${item.id}`)}
        onEdit={() => router.push(`/(app)/inventory/${item.id}/edit`)}
      />
    ),
    [router]
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={paginatedProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        removeClippedSubviews={Platform.OS === "android"}
        maxToRenderPerBatch={8}
        windowSize={5}
        initialNumToRender={6}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View>
            {loadingMore ? <ActivityIndicator color="#0F920F" style={{ marginVertical: 16 }} /> : null}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={["#0F920F"]}
            tintColor="#0F920F"
          />
        }
      />

      {/* Floating Action Button for Add Product */}
      <Pressable
        onPress={() => router.push("/(app)/inventory/create")}
        accessibilityRole="button"
        accessibilityLabel="Add new product"
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Plus size={26} color="#FFFFFF" />
      </Pressable>

      {/* Options Popup Modal (image 1.png) */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuCard}>
            <Pressable
              onPress={() => {
                setMenuVisible(false);
                setFilterTab("archived");
              }}
              style={styles.menuItem}
            >
              <Archive size={16} color="#374151" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>View Archived Listings</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setMenuVisible(false);
                router.push("/(app)/boosts");
              }}
              style={styles.menuItem}
            >
              <TrendingUp size={16} color="#374151" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Marketing & Boosts</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setMenuVisible(false);
                router.push("/(app)/advisories");
              }}
              style={styles.menuItem}
            >
              <BookOpen size={16} color="#374151" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Listing Advisories & Help</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 96,
  },
  listHeader: {
    marginBottom: spacing.base,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 8,
  },
  titleContainer: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    fontFamily: fonts.heading.bold,
  },
  screenSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: fonts.body.regular,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    justifyContent: "center",
  },
  metricCardActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  metricCardLowStock: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  metricCardOutOfStock: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: fonts.heading.bold,
  },
  metricTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  metricSubtitle: {
    fontSize: 10,
    marginTop: 1,
    fontWeight: "500",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    fontFamily: fonts.body.regular,
  },
  clearButton: {
    padding: 4,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipSelected: {
    backgroundColor: "#0F920F",
    borderColor: "#0F920F",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  categoryScrollContainer: {
    marginBottom: 14,
  },
  categoryRow: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryPillSelected: {
    backgroundColor: "#065F46",
    borderColor: "#065F46",
  },
  categoryPillText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },
  categoryPillTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  filterSortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  filterGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pillControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  pillControlText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  filterBadge: {
    backgroundColor: "#0F920F",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  countText: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: fonts.body.regular,
  },
  centerContainer: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  emptySub: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  primaryActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F920F",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  primaryActionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0F920F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0F920F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: {
    backgroundColor: "#0C770C",
    transform: [{ scale: 0.95 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 64,
    paddingRight: 16,
  },
  menuCard: {
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
});
