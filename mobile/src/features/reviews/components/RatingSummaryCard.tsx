import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MessageSquare, Star } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { ReviewsSummary } from "../types";

interface RatingSummaryCardProps {
  summary: ReviewsSummary;
}

export const RatingSummaryCard: React.FC<RatingSummaryCardProps> = ({ summary }) => {
  const avgNumber = summary.average ? parseFloat(summary.average) : 0;
  const count = summary.count;
  const stars = [5, 4, 3, 2, 1] as const;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.scoreCol}>
          <Text style={styles.scoreText}>
            {summary.average ? summary.average : "—"}
          </Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                color="#EAB308"
                fill={star <= Math.round(avgNumber) ? "#EAB308" : "transparent"}
              />
            ))}
          </View>
          <Text style={styles.countText}>
            {count === 1 ? "1 review" : `${count} reviews`}
          </Text>
        </View>

        <View style={styles.barsCol}>
          {stars.map((star) => {
            const starCount = summary.breakdown[star] || 0;
            const pct = count > 0 ? (starCount / count) * 100 : 0;
            return (
              <View key={star} style={styles.barRow}>
                <Text style={styles.barLabel}>{star}★</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.barCount}>{starCount}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {summary.unansweredCount > 0 ? (
        <View style={styles.unansweredNotice}>
          <MessageSquare size={14} color="#D97706" />
          <Text style={styles.unansweredText}>
            {summary.unansweredCount === 1
              ? "1 review is waiting for your reply"
              : `${summary.unansweredCount} reviews are waiting for your reply`}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreCol: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: spacing.base,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    minWidth: 100,
  },
  scoreText: {
    fontFamily: fonts.heading.bold,
    fontSize: 34,
    color: colors.text,
    lineHeight: 40,
  },
  starRow: {
    flexDirection: "row",
    gap: 2,
    marginVertical: spacing.xs,
  },
  countText: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  barsCol: {
    flex: 1,
    paddingLeft: spacing.base,
    gap: 4,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  barLabel: {
    fontFamily: fonts.body.medium,
    fontSize: 11,
    color: colors.textMuted,
    width: 22,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: radii.full,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: radii.full,
    backgroundColor: "#EAB308",
  },
  barCount: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    width: 20,
    textAlign: "right",
  },
  unansweredNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.input,
    marginTop: spacing.md,
  },
  unansweredText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
    color: "#B45309",
    flex: 1,
  },
});
