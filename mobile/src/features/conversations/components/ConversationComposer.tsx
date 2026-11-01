import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { ImagePlus, Send, X } from "lucide-react-native";
import { colors } from "../../../theme";
import { styles } from "./ConversationComposerStyles";

interface ConversationComposerProps {
  isClosed: boolean;
  draft: string;
  onChangeDraft: (text: string) => void;
  inputRef: React.RefObject<TextInput | null>;
  attachment: { url: string; filename: string } | null;
  onRemoveAttachment: () => void;
  uploading: boolean;
  sending: boolean;
  onPickImage: () => void;
  onSend: () => void;
  paused: boolean;
  sendError: string | null;
  onRetrySend: () => void;
}

export function ConversationComposer({
  isClosed,
  draft,
  onChangeDraft,
  inputRef,
  attachment,
  onRemoveAttachment,
  uploading,
  sending,
  onPickImage,
  onSend,
  paused,
  sendError,
  onRetrySend,
}: ConversationComposerProps) {
  if (isClosed) {
    return (
      <View style={styles.closedBar}>
        <Text style={styles.closedText}>This chat is closed.</Text>
      </View>
    );
  }

  const canSend = !sending && !uploading && (draft.trim().length > 0 || attachment !== null);

  return (
    <View style={styles.container}>
      {paused ? (
        <View style={styles.statusLine}>
          <Text style={styles.pausedText}>Reconnecting… new messages may be late.</Text>
        </View>
      ) : null}

      {sendError ? (
        <View style={styles.statusLine}>
          <Text style={styles.errorText} numberOfLines={2}>
            {sendError}
          </Text>
          <Pressable
            onPress={onRetrySend}
            accessibilityRole="button"
            accessibilityLabel="Try again"
            style={styles.retryBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.retryBtnText}>Try Again</Text>
          </Pressable>
        </View>
      ) : null}

      {uploading ? (
        <View style={styles.previewStrip}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.previewText}>Uploading…</Text>
        </View>
      ) : attachment ? (
        <View style={styles.previewStrip}>
          <Image source={{ uri: attachment.url }} style={styles.previewThumb} />
          <Text style={styles.previewText}>Photo ready</Text>
          <Pressable
            onPress={onRemoveAttachment}
            accessibilityRole="button"
            accessibilityLabel="Remove photo"
            style={styles.removePhotoBtn}
          >
            <X size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.row}>
        <Pressable
          onPress={onPickImage}
          disabled={uploading || sending}
          accessibilityRole="button"
          accessibilityLabel="Add photo"
          style={styles.actionBtn}
        >
          <ImagePlus size={20} color={colors.textMuted} />
        </Pressable>

        <TextInput
          ref={inputRef}
          value={draft}
          onChangeText={onChangeDraft}
          placeholder="Write a message"
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={2000}
          editable={!sending}
          style={styles.input}
        />

        <Pressable
          onPress={onSend}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
        >
          {sending ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Send size={18} color={colors.white} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
