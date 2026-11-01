import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Info } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import { safeBack } from "../../../utils/safeBack";

interface ConversationHeaderBarProps {
  senderName: string;
  subtitle?: string | null;
  avatarBg: string;
  initials: string;
  buyerImage?: string | null;
  /** Opens the order or listing this chat is about. Hidden when there is none. */
  onInfo?: () => void;
}

export function ConversationHeaderBar({ senderName, subtitle, avatarBg, initials, buyerImage, onInfo }: ConversationHeaderBarProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  return (
    <View style={styles.navBar}>
      <Pressable onPress={() => safeBack(router)} accessibilityRole="button" accessibilityLabel="Go back" style={styles.iconButton}>
        <ChevronLeft size={24} color={colors.text} />
      </Pressable>

      <View style={[styles.avatarBox, { backgroundColor: avatarBg }]}>
        {buyerImage && !imgError ? (
          <Image source={{ uri: buyerImage }} style={styles.avatarImage} onError={() => setImgError(true)} />
        ) : (
          <Text style={styles.initialsText}>{initials}</Text>
        )}
      </View>

      <View style={styles.headerInfo}>
        <Text style={styles.senderTitle} numberOfLines={1}>{senderName}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>

      {onInfo ? (
        <Pressable onPress={onInfo} accessibilityRole="button" accessibilityLabel="Open details" style={styles.iconButton}>
          <Info size={22} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
  iconButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  avatarBox: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  avatarImage: { width: 44, height: 44, borderRadius: 22 },
  initialsText: { fontFamily: fonts.heading.bold, fontSize: 15, color: colors.white },
  headerInfo: { flex: 1, marginLeft: spacing.md },
  senderTitle: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 1 },
});
