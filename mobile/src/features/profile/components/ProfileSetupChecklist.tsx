import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowRight, Check, Circle, CircleDot } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

interface Step {
  title: string;
  hint: string;
  done: boolean;
}

interface Props {
  steps: Step[];
  onContinue: () => void;
}

export function ProfileSetupChecklist({ steps, onContinue }: Props) {
  const doneCount = steps.filter((step) => step.done).length;
  const nextIndex = steps.findIndex((step) => !step.done);
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.title}>Finish Setting Up</Text>
        <View style={styles.count}><Text style={styles.countText}>{doneCount} of {steps.length} done</Text></View>
      </View>
      <Text style={styles.sub}>Complete these steps to become a verified seller.</Text>
      {steps.map((step, index) => {
        const next = index === nextIndex;
        return (
          <View key={step.title} style={[styles.step, next && styles.stepNext, step.done && styles.stepDone]}>
            {step.done ? <View style={styles.tick}><Check size={14} color={colors.white} strokeWidth={3} /></View> : next ? <CircleDot size={22} color={colors.primary} /> : <Circle size={22} color={colors.border} />}
            <View style={styles.stepText}>
              <Text style={[styles.stepTitle, !step.done && !next && styles.stepMuted]}>{step.title}</Text>
              {next ? <Text style={styles.stepHint}>Next step • {step.hint}</Text> : null}
            </View>
            {step.done ? <Text style={styles.done}>Done</Text> : !next ? <Text style={styles.later}>Step {index + 1}</Text> : <ArrowRight size={18} color={colors.primary} />}
          </View>
        );
      })}
      <Pressable onPress={onContinue} accessibilityRole="button" style={({ pressed }) => [styles.cta, pressed && { backgroundColor: colors.primaryPressed }]}>
        <Text style={styles.ctaText}>Continue</Text>
        <ArrowRight size={18} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.sheet, borderWidth: 1.5, borderColor: profileColors.amberBorder, padding: spacing.base, marginBottom: spacing.base },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text },
  count: { backgroundColor: profileColors.amber, borderRadius: radii.full, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: profileColors.amberText },
  sub: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  step: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 56, borderRadius: radii.button, borderWidth: 1, borderColor: profileColors.border, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  stepNext: { borderColor: colors.primary, backgroundColor: colors.primarySurface },
  stepDone: { backgroundColor: "#FAFAF7" },
  tick: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  stepText: { flex: 1 },
  stepTitle: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  stepMuted: { color: colors.textMuted },
  stepHint: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.primary, marginTop: 2 },
  done: { fontFamily: fonts.body.semiBold, fontSize: 12, color: profileColors.mintText, backgroundColor: profileColors.mint, borderRadius: radii.sm, paddingHorizontal: 8, paddingVertical: 3, overflow: "hidden" },
  later: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  cta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, minHeight: 52, borderRadius: radii.button, backgroundColor: colors.primary, marginTop: spacing.xs },
  ctaText: { fontFamily: fonts.body.semiBold, fontSize: 16, color: colors.white },
});
