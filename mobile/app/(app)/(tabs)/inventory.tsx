import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Search, X, Plus, Package, SlidersHorizontal } from "lucide-react-native";
import { useInventory, type InventoryFilterTab } from "../../../src/features/inventory/hooks/useInventory";
import { ProductCard } from "../../../src/features/inventory/components/ProductCard";
import { PRODUCT_CATEGORIES, type ProductCategory } from "../../../src/features/inventory/types";
import { colors, fonts, radii, spacing, touchTargets } from "../../../src/theme";

export default function InventoryScreen() {
  const router = useRouter();
  const {
    filteredProducts,
    loading,
    refreshing,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filterTab,
    setFilterTab,
    refresh,
  } = useInventory();

  const handleClearSearch = () => setSearchQuery("");

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {/* 1. Search Bar */}
      <View style={styles.searchBar}>
        <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          placeholder="Search products by name or category..."
          placeholderTextColor={colors.textMuted}
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
            <X size={16} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* 2. Status Filter Tabs */}
      <View style={styles.tabRow}>
        {(
          [
            { id: "all", label: "All" },
            { id: "low_stock", label: "Low Stock" },
            { id: "out_of_stock", label: "Out of Stock" },
            { id: "archived", label: "Archived" },
          ] as { id: InventoryFilterTab; label: string }[]
        ).map((tab) => {
          const isSelected = filterTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setFilterTab(tab.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              style={[styles.statusTab, isSelected && styles.statusTabSelected]}
            >
              <Text
                style={[
                  styles.statusTabText,
                  isSelected && styles.statusTabTextSelected,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 3. Category Horizontal Pills */}
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

      {/* Total match indicator */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
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
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
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
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Clear Search</Text>
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
          <Package size={36} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>Your inventory is empty</Text>
        <Text style={styles.emptySub}>
          Add your first vegetable surplus product to start managing inventory and receiving orders.
        </Text>
        <Pressable
          onPress={() => router.push("/(app)/inventory/create")}
          accessibilityRole="button"
          accessibilityLabel="Add your first product"
          style={styles.addFirstButton}
        >
          <Plus size={18} color={colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.addFirstButtonText}>Add Product</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/(app)/inventory/${item.id}`)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
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
        <Plus size={24} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: 90, // Room for FAB
  },
  listHeader: {
    marginBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: touchTargets.min,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.text,
    height: "100%",
  },
  clearButton: {
    padding: spacing.xs,
  },
  tabRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  statusTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 36,
  },
  statusTabSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusTabText: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: colors.text,
  },
  statusTabTextSelected: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
  },
  categoryScrollContainer: {
    marginHorizontal: -spacing.base,
    marginBottom: spacing.sm,
  },
  categoryRow: {
    paddingHorizontal: spacing.base,
    gap: spacing.xs,
  },
  categoryPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 32,
    justifyContent: "center",
  },
  categoryPillSelected: {
    backgroundColor: "rgba(31, 77, 58, 0.12)",
    borderColor: colors.primary,
  },
  categoryPillText: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.text,
  },
  categoryPillTextSelected: {
    color: colors.primary,
    fontFamily: fonts.body.semiBold,
  },
  countRow: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  countText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.textMuted,
  },
  centerContainer: {
    paddingVertical: spacing.xxxl,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySub: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  addFirstButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: radii.button,
    minHeight: touchTargets.min,
  },
  addFirstButtonText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 14,
    color: colors.white,
  },
  retryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radii.button,
    minHeight: touchTargets.min,
    justifyContent: "center",
  },
  retryButtonText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabPressed: {
    backgroundColor: colors.primaryPressed,
  },
});
