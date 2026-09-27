import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CheckCircle2, Clock, MessageSquare, Package, Send } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import type { SellerProductInquiryItem } from "../types";

interface ProductInquiryCardProps {
  inquiry: SellerProductInquiryItem;
  onReply: (id: string, text: string) => Promise<void>;
  isReplying: boolean;
}

export function ProductInquiryCard({ inquiry, onReply, isReplying }: ProductInquiryCardProps) {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [localError, setLocalError] = useState("");
  const isAnswered = Boolean(inquiry.reply);

  async function handleSendReply() {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    setLocalError("");
    try {
      await onReply(inquiry.id, trimmed);
      setReplyText("");
      setShowReplyBox(false);
    } catch (err: any) {
      setLocalError(err?.message || "Failed to send reply. Please try again.");
    }
  }

  return (
    <View style={[styles.card, !isAnswered && styles.openCard]}>
      {/* Product Name Header */}
      <View style={styles.headerRow}>
        <View style={styles.productBadge}>
          <Package size={14} color={colors.primary} />
          <Text style={styles.productName} numberOfLines={1}>
            {inquiry.productName}
          </Text>
        </View>

        <View style={[styles.statusBadge, isAnswered ? styles.statusAnswered : styles.statusOpen]}>
          {isAnswered ? (
            <>
              <CheckCircle2 size={12} color={colors.success} />
              <Text style={styles.statusAnsweredText}>Answered</Text>
            </>
          ) : (
            <>
              <Clock size={12} color={colors.warning} />
              <Text style={styles.statusOpenText}>Waiting for reply</Text>
            </>
          )}
        </View>
      </View>

      {/* Buyer Question */}
      <View style={styles.questionBlock}>
        <Text style={styles.questionLabel}>Buyer question:</Text>
        <Text style={styles.questionText}>{inquiry.question}</Text>
        <Text style={styles.dateText}>
          Asked on {new Date(inquiry.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>

      {/* Seller Reply if present */}
      {isAnswered && (
        <View style={styles.replyBlock}>
          <Text style={styles.replyLabel}>Your reply:</Text>
          <Text style={styles.replyText}>{inquiry.reply}</Text>
          {inquiry.repliedAt && (
            <Text style={styles.dateText}>
              Sent on {new Date(inquiry.repliedAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </Text>
          )}
        </View>
      )}

      {/* Inline Reply Composer for Open Questions */}
      {!isAnswered && (
        <View style={styles.composerSection}>
          {showReplyBox ? (
            <View style={styles.inputContainer}>
              <TextInput
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Write your answer to the buyer..."
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={1000}
                style={styles.textInput}
                editable={!isReplying}
              />
              {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
              <View style={styles.composerButtons}>
                <Pressable
                  onPress={() => setShowReplyBox(false)}
                  disabled={isReplying}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSendReply}
                  disabled={isReplying || !replyText.trim()}
                  style={[styles.sendButton, (!replyText.trim() || isReplying) && styles.sendButtonDisabled]}
                >
                  {isReplying ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <>
                      <Send size={14} color={colors.white} />
                      <Text style={styles.sendButtonText}>Send Reply</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => setShowReplyBox(true)}
              style={styles.openReplyButton}
            >
              <MessageSquare size={16} color={colors.primary} />
              <Text style={styles.openReplyButtonText}>Write Reply</Text>
            </Pressable>
          )}
        </View>
      )}
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
    marginBottom: spacing.sm,
  },
  openCard: {
    borderColor: colors.primary,
    backgroundColor: "rgba(31, 77, 58, 0.02)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  productBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  productName: {
    fontFamily: fonts.heading.bold,
    fontSize: 15,
    color: colors.text,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  statusAnswered: {
    backgroundColor: "rgba(63, 125, 88, 0.12)",
  },
  statusAnsweredText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: colors.success,
  },
  statusOpen: {
    backgroundColor: "rgba(199, 149, 62, 0.15)",
  },
  statusOpenText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: colors.warning,
  },
  questionBlock: {
    marginTop: spacing.xs,
  },
  questionLabel: {
    fontFamily: fonts.body.semiBold,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  questionText: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  dateText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  replyBlock: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radii.input,
    backgroundColor: "rgba(31, 77, 58, 0.05)",
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  replyLabel: {
    fontFamily: fonts.body.semiBold,
    fontSize: 11,
    color: colors.primary,
    marginBottom: 2,
  },
  replyText: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.text,
  },
  composerSection: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  openReplyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: touchTargets.min,
    backgroundColor: "rgba(31, 77, 58, 0.08)",
    borderRadius: radii.button,
  },
  openReplyButtonText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  inputContainer: {
    gap: spacing.xs,
  },
  textInput: {
    minHeight: 70,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    padding: spacing.sm,
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.text,
    backgroundColor: colors.surface,
    textAlignVertical: "top",
  },
  composerButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },
  cancelButton: {
    height: 36,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  sendButton: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radii.button,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontFamily: fonts.body.semiBold,
    fontSize: 13,
    color: colors.white,
  },
  errorText: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: colors.error,
  },
});
