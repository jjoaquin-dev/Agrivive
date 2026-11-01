import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Clock, MessageSquare, Package } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { SellerProductInquiryItem } from "../types";
import { QuestionAnswerBox } from "./QuestionAnswerBox";

interface QuestionCardProps {
  inquiry: SellerProductInquiryItem;
  onReply: (id: string, text: string) => Promise<void>;
  isReplying: boolean;
  onAnswerSuccess?: () => void;
}

function formatAskedDate(createdAt: string, isWaiting: boolean): string {
  const d = new Date(createdAt);
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const base = `Asked ${month} ${day}, ${time}`;
  if (!isWaiting) return base;

  const diffMs = Math.max(0, Date.now() - d.getTime());
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let ago = "";
  if (diffHours < 1) {
    ago = `${Math.max(1, diffMins)} min ago`;
  } else if (diffHours < 24) {
    ago = `${diffHours} hrs ago`;
  } else if (diffDays === 1) {
    ago = "1 day ago";
  } else {
    ago = `${diffDays} days ago`;
  }
  return `${base} · ${ago}`;
}

function formatSentDate(repliedAt: string): string {
  const d = new Date(repliedAt);
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `Sent on ${month} ${day}, ${time}`;
}

export function QuestionCard({ inquiry, onReply, isReplying, onAnswerSuccess }: QuestionCardProps) {
  const [showAnswerBox, setShowAnswerBox] = useState(false);
  const isAnswered = Boolean(inquiry.reply);

  const handleSend = async (text: string) => {
    await onReply(inquiry.id, text);
    setShowAnswerBox(false);
    onAnswerSuccess?.();
  };

  return (
    <View style={[styles.card, !isAnswered && styles.openCard]}>
      <View style={styles.headerRow}>
        <View style={styles.productBadge}>
          <Package size={14} color={colors.primary} />
          <Text style={styles.productName} numberOfLines={1}>
            {inquiry.productName}
          </Text>
        </View>

        <View style={[styles.statusBadge, isAnswered ? styles.statusAnswered : styles.statusWaiting]}>
          {isAnswered ? (
            <>
              <CheckCircle2 size={12} color={colors.success} />
              <Text style={styles.statusAnsweredText}>Answered</Text>
            </>
          ) : (
            <>
              <Clock size={12} color={colors.warning} />
              <Text style={styles.statusWaitingText}>Waiting for You</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.questionBlock}>
        <Text style={styles.sectionLabel}>Question</Text>
        <Text style={styles.questionText}>{inquiry.question}</Text>
        <Text style={styles.dateText}>{formatAskedDate(inquiry.createdAt, !isAnswered)}</Text>
      </View>

      {isAnswered && inquiry.reply ? (
        <View style={styles.replyBlock}>
          <Text style={styles.sectionLabel}>Your Answer</Text>
          <Text style={styles.replyText}>{inquiry.reply}</Text>
          {inquiry.repliedAt ? (
            <Text style={styles.dateText}>{formatSentDate(inquiry.repliedAt)}</Text>
          ) : null}
        </View>
      ) : null}

      {!isAnswered ? (
        showAnswerBox ? (
          <QuestionAnswerBox
            onSend={handleSend}
            onCancel={() => setShowAnswerBox(false)}
            isReplying={isReplying}
          />
        ) : (
          <Pressable
            onPress={() => setShowAnswerBox(true)}
            accessibilityRole="button"
            accessibilityLabel="Answer"
            style={({ pressed }) => [styles.answerBtn, pressed && styles.answerBtnPressed]}
          >
            <MessageSquare size={16} color={colors.primary} />
            <Text style={styles.answerBtnText}>Answer</Text>
          </Pressable>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  openCard: { borderColor: "#FED7AA" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  productBadge: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1, marginRight: spacing.sm },
  productName: { fontFamily: fonts.heading.bold, fontSize: 13, color: colors.text, flex: 1 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.full },
  statusAnswered: { backgroundColor: "#DCFCE7" },
  statusAnsweredText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.success },
  statusWaiting: { backgroundColor: "#FEF3C7" },
  statusWaitingText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: colors.warning },
  questionBlock: { marginTop: spacing.xs },
  replyBlock: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  sectionLabel: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  questionText: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.text, lineHeight: 20 },
  replyText: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.text, lineHeight: 20 },
  dateText: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted, marginTop: 4 },
  answerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    marginTop: spacing.md,
  },
  answerBtnPressed: { backgroundColor: colors.primarySurface },
  answerBtnText: { fontFamily: fonts.heading.bold, fontSize: 14, color: colors.primary },
});
