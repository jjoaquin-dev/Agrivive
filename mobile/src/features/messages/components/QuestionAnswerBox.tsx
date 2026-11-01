import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Send } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface QuestionAnswerBoxProps {
  onSend: (text: string) => Promise<void>;
  onCancel: () => void;
  isReplying: boolean;
}

export function QuestionAnswerBox({ onSend, onCancel, isReplying }: QuestionAnswerBoxProps) {
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");

  const handleSend = async () => {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    setError("");
    try {
      await onSend(trimmed);
      setReplyText("");
    } catch (err: any) {
      setError(err?.message || "Failed to send answer. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={replyText}
        onChangeText={(val) => {
          setReplyText(val);
          if (error) setError("");
        }}
        placeholder="Write your answer to the buyer..."
        placeholderTextColor={colors.textMuted}
        multiline
        maxLength={1000}
        style={styles.textInput}
        editable={!isReplying}
      />

      <View style={styles.counterRow}>
        <Text style={styles.counterText}>{replyText.length}/1000</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.buttonRow}>
        <Pressable
          onPress={onCancel}
          disabled={isReplying}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          style={({ pressed }) => [styles.cancelBtn, pressed && styles.cancelBtnPressed]}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>

        <Pressable
          onPress={handleSend}
          disabled={isReplying || !replyText.trim()}
          accessibilityRole="button"
          accessibilityLabel="Send Answer"
          style={({ pressed }) => [
            styles.sendBtn,
            (!replyText.trim() || isReplying) && styles.sendBtnDisabled,
            pressed && styles.sendBtnPressed,
          ]}
        >
          {isReplying ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Send size={15} color={colors.white} />
              <Text style={styles.sendBtnText}>Send Answer</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: spacing.md },
  textInput: {
    minHeight: 84,
    maxHeight: 160,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.input,
    padding: spacing.md,
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: "top",
  },
  counterRow: { alignItems: "flex-end", marginTop: 4 },
  counterText: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted },
  errorText: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.error, marginTop: 4 },
  buttonRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  cancelBtnPressed: { backgroundColor: colors.surfaceMuted },
  cancelBtnText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.textMuted },
  sendBtn: {
    flex: 2,
    height: 48,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sendBtnPressed: { backgroundColor: colors.primaryPressed },
  sendBtnDisabled: { backgroundColor: colors.border },
  sendBtnText: { fontFamily: fonts.heading.bold, fontSize: 14, color: colors.white },
});
