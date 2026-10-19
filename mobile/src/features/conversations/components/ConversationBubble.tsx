import React, { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ExternalLink, X } from "lucide-react-native";
import type { ConversationMessage } from "../types";
import { colors, fonts, radii, spacing } from "../../../theme";

function parseContent(text: string) {
  const match = text.match(/(https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|webp|gif)(?:\?[^\s]*)?)/i);
  if (!match) return { text, imageUrl: null };
  const imageUrl = match[1];
  const remainingText = text.replace(imageUrl, "").trim();
  return { text: remainingText, imageUrl };
}

export function ConversationBubble({
  item,
  isMine,
  senderName,
}: {
  item: ConversationMessage;
  isMine: boolean;
  senderName?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const { text, imageUrl } = parseContent(item.body);

  return (
    <View style={[styles.bubble, isMine ? styles.mine : styles.theirs]}>
      <Text style={styles.sender}>{isMine ? "You" : (senderName || "Buyer")}</Text>
      {imageUrl ? (
        <>
          <Pressable onPress={() => setModalOpen(true)} style={styles.imageWrapper}>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.badge}>
              <ExternalLink size={10} color={colors.white} />
              <Text style={styles.badgeText}>View</Text>
            </View>
          </Pressable>
          <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
            <View style={styles.modalBg}>
              <Pressable style={styles.modalClose} onPress={() => setModalOpen(false)}>
                <X size={24} color={colors.white} />
              </Pressable>
              <Image source={{ uri: imageUrl }} style={styles.fullImage} resizeMode="contain" />
            </View>
          </Modal>
        </>
      ) : null}
      {text ? <Text style={styles.body}>{text}</Text> : null}
      <Text style={styles.time}>
        {new Date(item.createdAt).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: "84%", padding: spacing.md, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border },
  mine: { alignSelf: "flex-end", backgroundColor: "rgba(31, 77, 58, 0.12)" },
  theirs: { alignSelf: "flex-start", backgroundColor: colors.surface },
  sender: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.primary },
  imageWrapper: { marginTop: 6, borderRadius: radii.button, overflow: "hidden", position: "relative" },
  image: { width: 220, height: 160, borderRadius: radii.button, backgroundColor: colors.background },
  badge: { position: "absolute", bottom: 6, right: 6, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(0,0,0,0.65)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: colors.white, fontSize: 10, fontFamily: fonts.body.regular },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  modalClose: { position: "absolute", top: 48, right: 24, zIndex: 10, padding: 8 },
  fullImage: { width: "95%", height: "80%" },
  body: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 21, color: colors.text, marginTop: 4 },
  time: { fontFamily: fonts.body.regular, fontSize: 10, color: colors.textMuted, marginTop: 6 },
});
