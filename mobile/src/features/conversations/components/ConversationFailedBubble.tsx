import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AlertCircle, RefreshCw } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { parseContent } from "./ConversationBubble";

interface Props {
  body: string;
  message: string;
  busy: boolean;
  onRetry: () => void;
}

/** A message that did not go out stays in the chat, marked in red, with one button to send it again (Error Prevention, Jarrett & Gaffney). */
export function ConversationFailedBubble({ body, message, busy, onRetry }: Props) {
  const { text, imageUrl } = parseContent(body);
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <AlertCircle size={20} color={colors.error} />
        <View style={styles.bubble}>
          <Text style={styles.body}>{text || (imageUrl ? "Photo" : body)}</Text>
        </View>
      </View>
      <View style={styles.status}>
        <Text style={styles.error} numberOfLines={2}>Not delivered. {message}</Text>
        <Pressable onPress={onRetry} disabled={busy} accessibilityRole="button" accessibilityLabel="Try again" style={[styles.retry, busy && styles.retryBusy]}>
          <RefreshCw size={14} color={colors.error} />
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: "flex-end", maxWidth: "88%", marginVertical: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, justifyContent: "flex-end" },
  bubble: { flexShrink: 1, backgroundColor: colors.primary, borderRadius: 18, borderBottomRightRadius: 4, borderWidth: 1.5, borderColor: colors.error, paddingHorizontal: 14, paddingVertical: 10 },
  body: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 21, color: colors.white },
  status: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: spacing.sm, marginTop: 4 },
  error: { flexShrink: 1, fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.error, textAlign: "right" },
  retry: { flexDirection: "row", alignItems: "center", gap: 4, minHeight: 44, paddingHorizontal: spacing.sm, borderRadius: radii.sm, borderWidth: 1, borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
  retryBusy: { opacity: 0.5 },
  retryText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.error },
});
