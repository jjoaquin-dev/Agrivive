import React from "react";
import { Image, Modal, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { MessageSquare, Share2, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, radii, spacing } from "../../../theme";

interface Props {
  visible: boolean;
  imageUrl: string | null;
  senderName: string;
  avatarBg: string;
  initials: string;
  buyerImage?: string | null;
  sentAtLabel: string;
  /** The listing the chat is about, if any. */
  listingName?: string | null;
  listingLine?: string | null;
  onClose: () => void;
}

/** Full-screen photo from the chat: who sent it and when, the listing it is about, and a way back (Jakob's Law). */
export function ConversationPhotoViewer({ visible, imageUrl, senderName, avatarBg, initials, buyerImage, sentAtLabel, listingName, listingLine, onClose }: Props) {
  const share = () => { if (imageUrl) void Share.share({ message: imageUrl, url: imageUrl }); };

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <SafeAreaView style={styles.screen}>
        <View style={styles.top}>
          <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
            {buyerImage ? <Image source={{ uri: buyerImage }} style={styles.avatarImg} /> : <Text style={styles.avatarText}>{initials}</Text>}
          </View>
          <View style={styles.who}>
            <Text style={styles.name} numberOfLines={1}>{senderName}</Text>
            <Text style={styles.sent} numberOfLines={1}>Sent in chat • {sentAtLabel}</Text>
          </View>
          <Pressable onPress={share} accessibilityRole="button" accessibilityLabel="Share photo" style={styles.round}>
            <Share2 size={20} color={colors.white} />
          </Pressable>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close photo" style={styles.round}>
            <X size={22} color={colors.white} />
          </Pressable>
        </View>

        <View style={styles.stage}>
          {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" /> : null}
        </View>

        <View style={styles.bottom}>
          {listingName ? (
            <View style={styles.listing}>
              <View style={styles.dot} />
              <Text style={styles.listingText} numberOfLines={1}>{listingName}</Text>
            </View>
          ) : null}
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Back to chat" style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
            <MessageSquare size={18} color={colors.white} />
            <Text style={styles.backText}>Back to Chat</Text>
          </Pressable>
          {listingLine ? <Text style={styles.foot} numberOfLines={2}>{listingLine}</Text> : null}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000000" },
  top: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  avatarImg: { width: 44, height: 44 },
  avatarText: { fontFamily: fonts.heading.bold, fontSize: 14, color: colors.white },
  who: { flex: 1 },
  name: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.white },
  sent: { fontFamily: fonts.body.regular, fontSize: 13, color: "#9CA3AF", marginTop: 1 },
  round: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" },
  stage: { flex: 1, justifyContent: "center" },
  image: { width: "100%", height: "100%" },
  bottom: { paddingHorizontal: spacing.base, paddingBottom: spacing.base, gap: spacing.md },
  listing: { flexDirection: "row", alignItems: "center", alignSelf: "center", gap: spacing.sm, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: radii.full, paddingHorizontal: spacing.base, paddingVertical: spacing.sm, maxWidth: "100%" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  listingText: { flexShrink: 1, fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.white },
  back: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, backgroundColor: colors.primary, borderRadius: radii.full },
  pressed: { opacity: 0.85 },
  backText: { fontFamily: fonts.body.semiBold, fontSize: 16, color: colors.white },
  foot: { fontFamily: fonts.body.regular, fontSize: 13, color: "#9CA3AF", textAlign: "center" },
});
