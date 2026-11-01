import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, MoreVertical } from "lucide-react-native";
import { fonts, spacing } from "../../../theme";
import { safeBack } from "../../../utils/safeBack";

interface ConversationHeaderBarProps {
  senderName: string;
  avatarBg: string;
  initials: string;
}

export function ConversationHeaderBar({ senderName, avatarBg, initials }: ConversationHeaderBarProps) {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <Pressable onPress={() => safeBack(router)} style={styles.iconBtn}>
        <ChevronLeft size={22} color="#111827" />
      </Pressable>
      <View style={[styles.avatarBox, { backgroundColor: avatarBg }]}>
        <Text style={styles.initialsText}>{initials}</Text>
        <View style={styles.onlineDot} />
      </View>
      <View style={styles.headerInfo}>
        <Text style={styles.senderTitle}>{senderName}</Text>
        <Text style={styles.onlineStatus}>● Online</Text>
      </View>
      <Pressable style={styles.iconBtn}>
        <MoreVertical size={20} color="#374151" />
      </Pressable>
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
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
    position: "relative",
  },
  initialsText: { fontFamily: fonts.heading.bold, fontSize: 14, color: "#FFFFFF" },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  headerInfo: { flex: 1, marginLeft: spacing.sm },
  senderTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: "#111827" },
  onlineStatus: { fontFamily: fonts.body.regular, fontSize: 12, color: "#16A34A" },
});
