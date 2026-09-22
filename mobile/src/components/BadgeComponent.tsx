import React from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import {
  BadgeCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react-native";
import { colors, radii, spacing } from "../theme";

export interface BadgeComponentProps {
  label: string;
  explanation?: string | null;
  variant?: "verified" | "success" | "warning" | "error" | "neutral" | "sage";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const BadgeComponent: React.FC<BadgeComponentProps> = ({
  label,
  explanation,
  variant = "neutral",
  style,
  textStyle,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.pill, styles[variant], style]}>
        {variant === "verified" ? (
          <BadgeCheck size={14} color={colors.primary} style={styles.badgeIcon} />
        ) : variant === "success" ? (
          <CheckCircle2 size={13} color={colors.success} style={styles.badgeIcon} />
        ) : variant === "warning" ? (
          <AlertCircle size={13} color={colors.warning} style={styles.badgeIcon} />
        ) : variant === "error" ? (
          <AlertTriangle size={13} color={colors.error} style={styles.badgeIcon} />
        ) : null}
        <Text
          style={[
            styles.textBase,
            styles[`${variant}Text` as keyof typeof styles],
            textStyle,
          ]}
        >
          {label}
        </Text>
      </View>
      {explanation ? (
        <Text style={styles.explanationText}>{explanation}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "flex-start",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    alignSelf: "flex-start",
  },
  badgeIcon: {
    marginRight: 4,
  },
  verified: {
    backgroundColor: "rgba(31, 77, 58, 0.12)",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  verifiedText: {
    color: colors.primary,
    fontWeight: "700",
  },
  success: {
    backgroundColor: "rgba(63, 125, 88, 0.12)",
  },
  successText: {
    color: colors.success,
  },
  warning: {
    backgroundColor: "rgba(199, 149, 62, 0.12)",
  },
  warningText: {
    color: colors.warning,
  },
  error: {
    backgroundColor: "rgba(184, 84, 80, 0.12)",
  },
  errorText: {
    color: colors.error,
  },
  sage: {
    backgroundColor: colors.sage,
  },
  sageText: {
    color: colors.primaryPressed,
  },
  neutral: {
    backgroundColor: "#ECEAE4",
  },
  neutralText: {
    color: colors.text,
  },
  textBase: {
    fontSize: 12,
    fontWeight: "600",
  },
  explanationText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
    lineHeight: 16,
  },
});
