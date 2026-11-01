import React, { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ExternalLink, X } from "lucide-react-native";
import type { ConversationMessage } from "../types";
import { colors, fonts, radii, spacing } from "../../../theme";
import { getAvatarColor, getInitials } from "../utils/avatar";

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
  isLastInGroup?: boolean;
  showSent?: boolean;
}

export function ConversationBubble({
  item,
  isMine,
  senderName = "Buyer",
  buyerImage,
  isFirstInGroup = true,
  isLastInGroup = true,
  showSent = false,
}: ConversationBubbleProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { text, imageUrl } = parseContent(item.body);
  const avatarBg = getAvatarColor(senderName);
  const initial = getInitials(senderName)[0] || "B";
  const formattedTime = new Date(item.createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <View style={[styles.container, isMine ? styles.containerMine : styles.containerTheirs]}>
      <View style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}>
        {!isMine && (
          <View style={styles.avatarSlot}>
            {isFirstInGroup ? (
              <View style={[styles.avatarBox, { backgroundColor: avatarBg }]}>
                {buyerImage && !imgError ? (
                  <Image
                    source={{ uri: buyerImage }}
                    style={styles.avatarImg}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <Text style={styles.avatarText}>{initial}</Text>
                )}
              </View>
            ) : null}
          </View>
        )}

        <View style={styles.bubbleWrapper}>
          <View style={[styles.bubble, isMine ? styles.mine : styles.theirs]}>
            {imageUrl ? (
              <>
                <Pressable
                  onPress={() => setModalOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="View full photo"
                  style={styles.imageWrapper}
                >
                  <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                  <View style={styles.badge}>
                    <ExternalLink size={10} color={colors.white} />
                    <Text style={styles.badgeText}>View</Text>
                  </View>
                </Pressable>

                <Modal
                  visible={modalOpen}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setModalOpen(false)}
                >
                  <View style={styles.modalBg}>
                    <Pressable
                      style={styles.modalClose}
                      onPress={() => setModalOpen(false)}
                      accessibilityRole="button"
                      accessibilityLabel="Close photo view"
                    >
                      <X size={24} color={colors.white} />
                    </Pressable>
                    <Image source={{ uri: imageUrl }} style={styles.fullImage} resizeMode="contain" />
                  </View>
                </Modal>
              </>
            ) : null}

            {text ? (
              <Text style={[styles.body, isMine ? styles.bodyMine : styles.bodyTheirs]}>{text}</Text>
            ) : null}
          </View>
        </View>
      </View>

      {isLastInGroup ? (
        <Text style={[styles.time, isMine ? styles.timeMine : styles.timeTheirs]}>
          {formattedTime}
          {showSent ? " · Sent" : ""}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 2, maxWidth: "86%" },
  containerMine: { alignSelf: "flex-end" },
  containerTheirs: { alignSelf: "flex-start" },
  row: { flexDirection: "row", alignItems: "flex-start" },
  rowMine: { justifyContent: "flex-end" },
  rowTheirs: { justifyContent: "flex-start" },
  avatarSlot: { width: 32, marginRight: 8, alignItems: "center" },
  avatarBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: { width: 28, height: 28 },
  avatarText: { fontFamily: fonts.heading.bold, fontSize: 12, color: colors.white },
  bubbleWrapper: { flexShrink: 1 },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  mine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  theirs: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  body: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 21 },
  bodyMine: { color: colors.white },
  bodyTheirs: { color: colors.text },
  time: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
    marginBottom: 4,
  },
  timeMine: { textAlign: "right", marginRight: 4 },
  timeTheirs: { textAlign: "left", marginLeft: 40 },
  imageWrapper: {
    marginBottom: 6,
    borderRadius: radii.button,
    overflow: "hidden",
    position: "relative",
  },
  image: { width: 220, height: 160, borderRadius: radii.button, backgroundColor: colors.surfaceMuted },
  badge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { color: colors.white, fontSize: 10, fontFamily: fonts.body.regular },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  modalClose: {
    position: "absolute",
    top: 48,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  fullImage: { width: "95%", height: "80%" },
});
