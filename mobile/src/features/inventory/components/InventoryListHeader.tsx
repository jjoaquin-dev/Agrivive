import React from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { ChevronDown, MoreVertical, Search, X } from "lucide-react-native";
import { colors } from "../../../theme";
import { NotificationBellButton } from "../../../components/NotificationBellButton";
import type { InventoryFilterTab } from "../hooks/useInventory";
import type { InventorySummary, ProductCategory } from "../types";
import { styles } from "./InventoryListHeaderStyles";

interface Props {
  summary: InventorySummary;
  listingCount: number;
  searchQuery: string;
  onSearch: (value: string) => void;
  category: ProductCategory | "all";
  onOpenCategory: () => void;
  filterTab: InventoryFilterTab;
  onFilterTab: (tab: InventoryFilterTab) => void;
  onOpenNotifications: () => void;
  onOpenMenu: () => void;
}

const TABS: { id: InventoryFilterTab; label: string; fg: string; bg: string; count: (s: InventorySummary) => number }[] = [
  { id: "all", label: "All", fg: colors.text, bg: "#F3F1EA", count: (s) => s.totalProducts },
  { id: "selling", label: "Selling", fg: colors.text, bg: "#F3F1EA", count: (s) => Math.max(0, s.activeCount - s.outOfStockCount) },
  { id: "low_stock", label: "Running low", fg: colors.warning, bg: "#FFF7ED", count: (s) => s.lowStockCount },
  { id: "out_of_stock", label: "Sold out", fg: colors.error, bg: "#FEF2F2", count: (s) => s.outOfStockCount },
  { id: "archived", label: "Archived", fg: colors.textMuted, bg: "#F3F1EA", count: (s) => s.archivedCount },
];

export function InventoryListHeader({
  summary, listingCount, searchQuery, onSearch, category, onOpenCategory, filterTab, onFilterTab, onOpenNotifications, onOpenMenu,
}: Props) {
  return (
    <View>
      <View style={styles.topBar}>
        <Text style={styles.title}>Listings</Text>
        <View style={styles.actions}>
          <NotificationBellButton onPress={onOpenNotifications} />
          <Pressable onPress={onOpenMenu} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="More options">
            <MoreVertical size={20} color="#374151" />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Search size={18} color={colors.textMuted} />
        <TextInput
          placeholder="Search your produce..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={onSearch}
          style={styles.searchInput}
          returnKeyType="search"
        />
        {searchQuery.length > 0 ? (
          <Pressable onPress={() => onSearch("")} accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={10}>
            <X size={16} color="#9CA3AF" />
          </Pressable>
        ) : null}
      </View>

      <Pressable onPress={onOpenCategory} style={styles.categoryButton} accessibilityRole="button" accessibilityLabel="Choose category">
        <Text style={styles.categoryLabel}>Category: <Text style={styles.categoryValue}>{category === "all" ? "All" : category}</Text></Text>
        <ChevronDown size={18} color={colors.textMuted} />
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll} contentContainerStyle={styles.chipRow}>
        {TABS.map((tab) => {
          const selected = filterTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => onFilterTab(tab.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={[styles.chip, { backgroundColor: selected ? colors.primary : tab.bg }]}
            >
              <Text style={[styles.chipText, { color: selected ? colors.white : tab.fg }]}>{tab.label} ({tab.count(summary)})</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryCount}>{listingCount} {listingCount === 1 ? "listing" : "listings"}</Text>
        <Text style={styles.summarySort}>Newest first</Text>
      </View>
    </View>
  );
}
