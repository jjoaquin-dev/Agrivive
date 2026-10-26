import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../theme";

export interface PaginationControlProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  itemLabel?: string;
}

export function PaginationControl({
  currentPage,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 20],
  onPageChange,
  onPageSizeChange,
  itemLabel = "items",
}: PaginationControlProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <View style={styles.container}>
      <View style={styles.sizeRow}>
        <View style={styles.sizeSelector}>
          <Text style={styles.sizeLabel}>Show:</Text>
          <View style={styles.pillGroup}>
            {pageSizeOptions.map((size) => {
              const active = size === pageSize;
              return (
                <Pressable
                  key={size}
                  onPress={() => {
                    onPageSizeChange(size);
                    onPageChange(1);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Show ${size} ${itemLabel} per page`}
                  style={[styles.sizePill, active && styles.sizePillActive]}
                >
                  <Text style={[styles.sizePillText, active && styles.sizePillTextActive]}>
                    {size}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.countText}>
          {totalItems === 0 ? `0 ${itemLabel}` : `${startItem}–${endItem} of ${totalItems}`}
        </Text>
      </View>

      {totalPages > 1 ? (
        <View style={styles.stepperRow}>
          <Pressable
            onPress={() => canGoPrev && onPageChange(currentPage - 1)}
            disabled={!canGoPrev}
            accessibilityRole="button"
            accessibilityLabel="Previous page"
            style={[styles.navButton, !canGoPrev && styles.buttonDisabled]}
          >
            <ChevronLeft size={18} color={canGoPrev ? colors.primary : colors.textMuted} />
            <Text style={[styles.navText, !canGoPrev && styles.textDisabled]}>Previous</Text>
          </Pressable>

          <Text style={styles.pageInfo}>
            Page <Text style={styles.pageBold}>{currentPage}</Text> of{" "}
            <Text style={styles.pageBold}>{totalPages}</Text>
          </Text>

          <Pressable
            onPress={() => canGoNext && onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            accessibilityRole="button"
            accessibilityLabel="Next page"
            style={[styles.navButton, !canGoNext && styles.buttonDisabled]}
          >
            <Text style={[styles.navText, !canGoNext && styles.textDisabled]}>Next</Text>
            <ChevronRight size={18} color={canGoNext ? colors.primary : colors.textMuted} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.base,
  },
  sizeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sizeSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  sizeLabel: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  pillGroup: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: radii.full,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sizePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  sizePillActive: {
    backgroundColor: colors.primary,
  },
  sizePillText: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  sizePillTextActive: {
    color: colors.white,
    fontFamily: fonts.body.semiBold,
  },
  countText: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    minHeight: touchTargets.min,
    minWidth: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.input,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  buttonDisabled: {
    opacity: 0.45,
    borderColor: colors.border,
  },
  navText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  textDisabled: {
    color: colors.textMuted,
  },
  pageInfo: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.text,
  },
  pageBold: {
    fontFamily: fonts.body.semiBold,
    color: colors.text,
  },
});
