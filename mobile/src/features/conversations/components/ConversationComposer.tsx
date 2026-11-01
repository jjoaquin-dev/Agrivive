import React from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { ImagePlus, Send } from "lucide-react-native";
import { colors } from "../../../theme";
import { styles } from "./ConversationComposerStyles";
import { ConversationClosedBar } from "./ConversationClosedBar";
import { ConversationUploadStrip } from "./ConversationUploadStrip";

interface ConversationComposerProps {
  isClosed: boolean;
  closedReason: string;
  draft: string;
  onChangeDraft: (text: string) => void;
  inputRef: React.RefObject<TextInput | null>;
  /** The chosen photo: its place on the phone while it uploads, and its link once it has. */
  photo: { uri: string; filename: string } | null;
  photoReady: boolean;
  onRemovePhoto: () => void;
  uploading: boolean;
  sending: boolean;
  onPickImage: () => void;
  onSend: () => void;
}

export function ConversationComposer({
  isClosed, closedReason, draft, onChangeDraft, inputRef, photo, photoReady, onRemovePhoto, uploading, sending, onPickImage, onSend,
}: ConversationComposerProps) {
  if (isClosed) return <ConversationClosedBar reason={closedReason} />;

  const canSend = !sending && !uploading && (draft.trim().length > 0 || photoReady);

  return (
    <View style={styles.container}>
      {photo ? <ConversationUploadStrip uri={photo.uri} filename={photo.filename} uploading={uploading} onRemove={onRemovePhoto} /> : null}

      <View style={styles.row}>
        <Pressable onPress={onPickImage} disabled={uploading || sending} accessibilityRole="button" accessibilityLabel="Add photo" style={[styles.actionBtn, (uploading || sending) && styles.disabled]}>
          <ImagePlus size={22} color={colors.primary} />
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

        <Pressable onPress={onSend} disabled={!canSend} accessibilityRole="button" accessibilityLabel="Send message" style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}>
          {sending ? <ActivityIndicator size="small" color={colors.white} /> : <Send size={20} color={colors.white} />}
        </Pressable>
      </View>
    </View>
  );
}
