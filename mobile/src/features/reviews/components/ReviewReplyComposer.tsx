import React from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { colors } from "../../../theme";
import { styles } from "./review-card.styles";

interface ReviewReplyComposerProps {
  replyText: string;
  onChangeText: (text: string) => void;
  submitting: boolean;
  error: string | null;
  onCancel: () => void;
  onSend: () => void;
}

export const ReviewReplyComposer: React.FC<ReviewReplyComposerProps> = ({
  replyText,
  onChangeText,
  submitting,
  error,
  onCancel,
  onSend,
}) => {
  return (
    <View style={styles.replyComposer}>
      <TextInput
        style={styles.replyInput}
        multiline
        placeholder="Write your reply to this customer..."
        placeholderTextColor={colors.textMuted}
        value={replyText}
        onChangeText={onChangeText}
        maxLength={2000}
        editable={!submitting}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.composerActions}>
        <Pressable
          onPress={onCancel}
          style={styles.cancelBtn}
          disabled={submitting}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={onSend}
          style={[styles.sendBtn, submitting && styles.sendBtnDisabled]}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.sendBtnText}>Send Reply</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};
