import { StyleSheet } from "react-native";
import { colors, radii, spacing } from "../../theme";

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
  },
  presetsSection: {
    marginBottom: spacing.sm,
  },
  presetTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  presetsRow: {
    gap: spacing.xs,
  },
  presetChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text,
  },
  presetChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  mapContainer: {
    borderRadius: radii.card,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: "#E8E6DF",
  },
  mapContainerError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  coordsInfo: {
    flex: 1,
  },
  coordsLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "500",
  },
  coordsValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
  },
  locButton: {
    minHeight: 36,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  locButtonText: {
    fontSize: 12,
  },
});

export default styles;
