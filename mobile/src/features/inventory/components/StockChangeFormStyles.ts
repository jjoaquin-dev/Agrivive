import { StyleSheet } from "react-native";
import { colors, radii, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.base, paddingTop: spacing.xs, paddingBottom: spacing.xl },
  quantityField: { marginBottom: spacing.sm },
  quantityInput: { borderWidth: 2, borderColor: colors.primary, minHeight: 52 },
  footer: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.lg },
  submitButton: { minHeight: 52, borderRadius: radii.button },
  submitText: { fontSize: 16 },
});
