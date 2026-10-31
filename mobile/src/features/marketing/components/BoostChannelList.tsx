import React from "react";
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { CheckCircle2, XCircle } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import type { BoostChannel, BoostChannels } from "../types";
import { PlatformBadge, platformName, type Platform } from "./PlatformBadge";

const labels = { waiting: "Waiting to post", posting: "Posting now", posted: "Posted", failed: "Did not post" } as const;

function Row({ platform, channel }: { platform: Platform; channel: BoostChannel }) {
  const done = channel.status === "posted";
  const failed = channel.status === "failed";
  const tone = done ? colors.success : failed ? colors.error : colors.textMuted;
  return (
    <View style={styles.row}>
      <PlatformBadge platform={platform} size={30} />
      <Text style={styles.name}>{platformName[platform]}</Text>
      <View style={styles.status}>
        {done ? <CheckCircle2 size={18} color={tone} /> : failed ? <XCircle size={18} color={tone} /> : <ActivityIndicator size="small" color={colors.primary} />}
        <Text style={[styles.statusText, { color: tone }]}>{labels[channel.status]}</Text>
      </View>
      {done && channel.postUrl ? (
        <Pressable onPress={() => void Linking.openURL(channel.postUrl as string)} accessibilityRole="link" hitSlop={8}>
          <Text style={styles.link}>View</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** One line for each platform. Each shows only what that platform answered. */
export function BoostChannelList({ channels }: { channels: BoostChannels | null | undefined }) {
  const fallback: BoostChannel = { status: "waiting", postUrl: null };
  return (
    <View style={styles.card} accessibilityLiveRegion="polite">
      <Row platform="facebook" channel={channels?.facebook ?? fallback} />
      <View style={styles.divider} />
      <Row platform="instagram" channel={channels?.instagram ?? fallback} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.base },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 56 },
  divider: { height: 1, backgroundColor: colors.border },
  name: { flex: 1, fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  status: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusText: { fontFamily: fonts.body.medium, fontSize: 13 },
  link: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.primary },
});
