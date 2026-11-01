import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Check, Maximize2 } from "lucide-react-native";
import type { ConversationMessage } from "../types";
import { colors, fonts, radii } from "../../../theme";
import { getAvatarColor, getInitials } from "../utils/avatar";
import { formatClock } from "../utils/chatFormat";

export function parseContent(text: string) {
  const match = text.match(/(https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|webp|gif)(?:\?[^\s]*)?)/i);
  if (!match) return { text, imageUrl: null };
  const imageUrl = match[1];
  const remainingText = text.replace(imageUrl, "").trim();
  return { text: remainingText, imageUrl };
}

interface ConversationBubbleProps {
  item: ConversationMessage;
  isMine: boolean;
  senderName?: string;
  buyerImage?: string | null;
  isFirstInGroup?: boolean;
  /** Only the newest message of the seller gets the sent tick. */
  showSent?: boolean;
  onOpenPhoto?: (imageUrl: string, item: ConversationMessage) => void;
}

export function ConversationBubble({ item, isMine, senderName = "Buyer", buyerImage, isFirstInGroup = true, showSent = false, onOpenPhoto }: ConversationBubbleProps) {
  const [imgError, setImgError] = useState(false);
  const { text, imageUrl } = parseContent(item.body);

  return (
    <View style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}>
      {!isMine ? (
        <View style={styles.avatarSlot}>
          {isFirstInGroup ? (
            <View style={[styles.avatarBox, { backgroundColor: getAvatarColor(senderName) }]}>
              {buyerImage && !imgError ? (
                <Image source={{ uri: buyerImage }} style={styles.avatarImg} onError={() => setImgError(true)} />
              ) : (
                <Text style={styles.avatarText}>{getInitials(senderName)}</Text>
              )}
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={[styles.bubble, isMine ? styles.mine : styles.theirs]}>
        {imageUrl ? (
          <Pressable onPress={() => onOpenPhoto?.(imageUrl, item)} accessibilityRole="button" accessibilityLabel="View full photo" style={styles.imageWrapper}>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.expand}>
              <Maximize2 size={11} color={colors.white} />
              <Text style={styles.expandText}>Tap to expand</Text>
            </View>
          </Pressable>
        ) : null}
        {text ? <Text style={[styles.body, isMine ? styles.bodyMine : styles.bodyTheirs]}>{text}</Text> : null}
        <View style={styles.meta}>
          <Text style={[styles.time, isMine && styles.timeMine]}>{formatClock(item.createdAt)}</Text>
          {isMine && showSent ? <Check size={14} color="rgba(255,255,255,0.9)" /> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", marginVertical: 2, maxWidth: "88%" },
  rowMine: { alignSelf: "flex-end" },
  rowTheirs: { alignSelf: "flex-start" },
  avatarSlot: { width: 32, marginRight: 6, alignItems: "center" },
  avatarBox: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  avatarImg: { width: 28, height: 28 },
  avatarText: { fontFamily: fonts.heading.bold, fontSize: 11, color: colors.white },
  bubble: { flexShrink: 1, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6, borderRadius: 18 },
  mine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  theirs: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  body: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 21 },
  bodyMine: { color: colors.white },
  bodyTheirs: { color: colors.text },
  meta: { flexDirection: "row", alignItems: "center", alignSelf: "flex-end", gap: 4, marginTop: 2 },
  time: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted },
  timeMine: { color: "rgba(255,255,255,0.85)" },
  imageWrapper: { marginBottom: 6, borderRadius: radii.button, overflow: "hidden" },
  image: { width: 220, height: 160, backgroundColor: colors.surfaceMuted },
  expand: { position: "absolute", bottom: 8, right: 8, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(0,0,0,0.65)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.full },
  expandText: { color: colors.white, fontSize: 11, fontFamily: fonts.body.medium },
});
