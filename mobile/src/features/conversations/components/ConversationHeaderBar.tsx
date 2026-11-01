import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import { safeBack } from "../../../utils/safeBack";

interface ConversationHeaderBarProps {
  senderName: string;
  avatarBg: string;
  initials: string;
  buyerImage?: string | null;
}

export function ConversationHeaderBar({
  senderName,
  avatarBg,
  initials,
  buyerImage,
}: ConversationHeaderBarProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  return (
    <View style={styles.navBar}>
      <Pressable
        onPress={() => safeBack(router)}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={styles.backButton}
      >
        <ChevronLeft size={22} color={colors.text} />
      </Pressable>

      <View style={[styles.avatarBox, { backgroundColor: avatarBg }]}>
        {buyerImage && !imgError ? (
          <Image
            source={{ uri: buyerImage }}
            style={styles.avatarImage}
            onError={() => setImgError(true)}
          />
        ) : (
          <Text style={styles.initialsText}>{initials}</Text>
        )}
      </View>

      <View style={styles.headerInfo}>
        <Text style={styles.senderTitle} numberOfLines={1}>
          {senderName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
    overflow: "hidden",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  initialsText: {
    fontFamily: fonts.heading.bold,
    fontSize: 14,
    color: colors.white,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  senderTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: colors.text,
  },
});
