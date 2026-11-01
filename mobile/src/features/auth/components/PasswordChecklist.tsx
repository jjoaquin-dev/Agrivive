import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { PASSWORD_RULES } from "../passwordRules";

interface PasswordChecklistProps {
  password: string;
  confirmPassword: string;
}

const STRENGTH = [
  { label: "Weak password", color: "#F43F5E" },
  { label: "Weak password", color: "#F43F5E" },
  { label: "Fair password", color: "#F59E0B" },
  { label: "Good password", color: "#10B981" },
  { label: "Strong password", color: colors.primary },
];

/** Shows each rule turning green as it is met, so people see what is missing before they tap the button (Visibility of System Status, Nielsen). */
export const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password, confirmPassword }) => {
  const met = PASSWORD_RULES.filter((rule) => rule.test(password)).length;
  const strength = met > 0 ? STRENGTH[met - 1] : null;
  const matches = Boolean(password && confirmPassword && password === confirmPassword);

  return (
    <View style={styles.card} accessibilityLiveRegion="polite">
      <View style={styles.strengthRow}>
        <Text style={styles.strengthTitle}>Password strength</Text>
        <Text style={[styles.strengthLabel, strength && { color: strength.color }]}>{strength?.label ?? "Enter password"}</Text>
      </View>
      <View style={styles.bars}>
        {PASSWORD_RULES.map((rule, index) => (
          <View key={rule.label} style={[styles.bar, strength && index < met && { backgroundColor: strength.color }]} />
        ))}
      </View>
      <View style={styles.rules}>
        {PASSWORD_RULES.map((rule) => (
          <RuleRow key={rule.label} label={rule.label} valid={rule.test(password)} />
        ))}
        {confirmPassword ? <RuleRow label="Passwords match" valid={matches} /> : null}
      </View>
    </View>
  );
};

const RuleRow: React.FC<{ label: string; valid: boolean }> = ({ label, valid }) => (
  <View style={styles.ruleRow}>
    <View style={[styles.tick, valid && styles.tickValid]}>
      <Check size={10} color={colors.white} strokeWidth={3} />
    </View>
    <Text style={[styles.ruleText, valid && styles.ruleTextValid]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, padding: spacing.md, gap: spacing.sm },
  strengthRow: { flexDirection: "row", justifyContent: "space-between" },
  strengthTitle: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.textMuted },
  strengthLabel: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.textMuted },
  bars: { flexDirection: "row", gap: 6 },
  bar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: "#E5E2DA" },
  rules: { gap: 6, marginTop: 2 },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  tick: { width: 16, height: 16, borderRadius: 8, backgroundColor: "#D1D5DB", alignItems: "center", justifyContent: "center" },
  tickValid: { backgroundColor: "#059669" },
  ruleText: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  ruleTextValid: { fontFamily: fonts.body.semiBold, color: "#047857" },
});
