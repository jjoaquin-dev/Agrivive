import React, { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertTriangle, ExternalLink, X } from "lucide-react-native";
import type { ConversationMessage } from "../types";
import { fonts, radii, spacing } from "../../../theme";
import { getAvatarColor, getInitials } from "../utils/avatar";

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
  senderName = "Buyer",
}: {
  item: ConversationMessage;
  isMine: boolean;
  senderName?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const { text, imageUrl } = parseContent(item.body);
  const isSystemAlert = text.toLowerCase().includes("expire") || text.toLowerCase().includes("system notice");
  const avatarBg = getAvatarColor(senderName);
  const initial = getInitials(senderName)[0] || "B";
  const formattedTime = new Date(item.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  if (isSystemAlert && !isMine) {
    return (
      <View style={styles.systemCard}>
        <View style={styles.systemHeader}>
          <AlertTriangle size={16} color="#B45309" />
          <Text style={styles.systemText}>{text}</Text>
        </View>
        <Text style={styles.systemTime}>{formattedTime}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}>
      {!isMine && (
        <View style={[styles.avatarInitial, { backgroundColor: avatarBg }]}>
          <Text style={styles.avatarInitialText}>{initial}</Text>
        </View>
      )}

      <View style={styles.bubbleWrapper}>
        <View style={[styles.bubble, isMine ? styles.mine : styles.theirs]}>
          {imageUrl ? (
            <>
              <Pressable onPress={() => setModalOpen(true)} style={styles.imageWrapper}>
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                <View style={styles.badge}>
                  <ExternalLink size={10} color="#FFFFFF" />
                  <Text style={styles.badgeText}>View</Text>
                </View>
              </Pressable>
              <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
                <View style={styles.modalBg}>
                  <Pressable style={styles.modalClose} onPress={() => setModalOpen(false)}>
                    <X size={24} color="#FFFFFF" />
                  </Pressable>
                  <Image source={{ uri: imageUrl }} style={styles.fullImage} resizeMode="contain" />
                </View>
              </Modal>
            </>
          ) : null}
          {text ? <Text style={[styles.body, isMine ? styles.bodyMine : styles.bodyTheirs]}>{text}</Text> : null}
        </View>
        <Text style={[styles.time, isMine ? styles.timeMine : styles.timeTheirs]}>
          {formattedTime}{isMine ? " · Sent" : ""}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", marginVertical: spacing.xs, maxWidth: "86%" },
  rowMine: { alignSelf: "flex-end" },
  rowTheirs: { alignSelf: "flex-start" },
  avatarInitial: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center", marginRight: 8, marginBottom: 16 },
  avatarInitialText: { fontFamily: fonts.heading.bold, fontSize: 12, color: "#FFFFFF" },
  bubbleWrapper: { flexShrink: 1 },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  mine: { backgroundColor: "#16A34A", borderBottomRightRadius: 4 },
  theirs: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", borderBottomLeftRadius: 4 },
  body: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 21 },
  bodyMine: { color: "#FFFFFF" },
  bodyTheirs: { color: "#111827" },
  time: { fontFamily: fonts.body.regular, fontSize: 11, color: "#9CA3AF", marginTop: 4 },
  timeMine: { textAlign: "right" },
  timeTheirs: { textAlign: "left" },
  imageWrapper: { marginBottom: 6, borderRadius: radii.button, overflow: "hidden", position: "relative" },
  image: { width: 220, height: 160, borderRadius: radii.button, backgroundColor: "#F3F4F6" },
  badge: { position: "absolute", bottom: 6, right: 6, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(0,0,0,0.65)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: "#FFFFFF", fontSize: 10, fontFamily: fonts.body.regular },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  modalClose: { position: "absolute", top: 48, right: 24, zIndex: 10, padding: 8 },
  fullImage: { width: "95%", height: "80%" },
  systemCard: { maxWidth: "86%", alignSelf: "flex-start", backgroundColor: "#FEF9C3", borderWidth: 1, borderColor: "#FDE047", borderRadius: 16, padding: spacing.md, marginVertical: spacing.xs },
  systemHeader: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  systemText: { flex: 1, fontFamily: fonts.body.medium, fontSize: 13, color: "#854D0E", lineHeight: 18 },
  systemTime: { fontFamily: fonts.body.regular, fontSize: 11, color: "#A16207", textAlign: "right", marginTop: 4 },
});
