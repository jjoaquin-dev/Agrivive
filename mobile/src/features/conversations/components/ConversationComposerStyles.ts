import { StyleSheet } from "react-native";
import { colors, fonts, spacing } from "../../../theme";

export const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  actionBtn: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: colors.primaryLight },
  disabled: { opacity: 0.5 },
  input: { flex: 1, minHeight: 48, maxHeight: 120, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.base, paddingVertical: 12, fontFamily: fonts.body.regular, fontSize: 15, color: colors.text },
  sendBtn: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary },
  sendBtnDisabled: { backgroundColor: colors.border },
});
