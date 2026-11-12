import { StyleSheet } from "react-native";
import { colors, fonts, radii, spacing } from "../../theme";

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
  },
  mapContainer: {
    borderRadius: radii.card,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  expandButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
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
    fontFamily: fonts.body.medium,
  },
  coordsValue: {
    fontSize: 13,
    color: colors.text,
    fontFamily: fonts.body.semiBold,
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
