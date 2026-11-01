import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ArrowUpDown, Search, X } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface MessagesHeaderProps {
  unreadCount: number;
  searchOpen: boolean;
  onToggleSearch: () => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  onOpenSort: () => void;
  hasCustomSort: boolean;
  onMarkAllRead: () => void;
  isMarkingAllRead?: boolean;
}

export function MessagesHeader({
  unreadCount,
  searchOpen,
  onToggleSearch,
  searchQuery,
  onChangeSearchQuery,
  onOpenSort,
  hasCustomSort,
  onMarkAllRead,
  isMarkingAllRead,
}: MessagesHeaderProps) {
  const subtitle = unreadCount > 0 ? `${unreadCount} unread` : "No unread messages";

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>Messages</Text>
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>{subtitle}</Text>
            {unreadCount > 0 ? (
              <>
                <Text style={styles.dotSeparator}>·</Text>
                <Pressable
                  onPress={onMarkAllRead}
                  disabled={isMarkingAllRead}
                  accessibilityRole="button"
                  accessibilityLabel="Mark all conversations as read"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.markReadText}>
                    {isMarkingAllRead ? "Marking…" : "Mark All as Read"}
                  </Text>
                </Pressable>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            onPress={onToggleSearch}
            accessibilityRole="button"
            accessibilityLabel="Search chats"
            style={[styles.iconButton, searchOpen && styles.iconButtonActive]}
          >
            <Search size={18} color={searchOpen ? colors.primary : colors.text} />
          </Pressable>

          <Pressable
            onPress={onOpenSort}
            accessibilityRole="button"
            accessibilityLabel="Sort chats"
            style={[styles.iconButton, hasCustomSort && styles.iconButtonActive]}
          >
            <ArrowUpDown size={18} color={hasCustomSort ? colors.primary : colors.text} />
            {hasCustomSort ? <View style={styles.sortDot} /> : null}
          </Pressable>
        </View>
      </View>

      {searchOpen && (
        <View style={styles.searchBar}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={onChangeSearchQuery}
            placeholder="Search name, produce or message"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            autoFocus
          />
          {searchQuery ? (
            <Pressable
              onPress={() => onChangeSearchQuery("")}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={16} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleColumn: { flex: 1 },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 22,
    color: colors.text,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  subtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: colors.textMuted,
    fontSize: 13,
  },
  markReadText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  iconButtonActive: {
    backgroundColor: colors.primaryLight,
  },
  sortDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    paddingHorizontal: spacing.md,
    height: 44,
    marginTop: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.text,
    padding: 0,
  },
});
