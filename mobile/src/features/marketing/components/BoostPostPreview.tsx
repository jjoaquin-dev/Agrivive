import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Globe, MoreHorizontal } from "lucide-react-native";
import { colors, fonts, radii, shadows, spacing } from "../../../theme";
import { PlatformBadge, platformName, type Platform } from "./PlatformBadge";

interface Props {
  name: string;
  imageUrl: string | null;
  price: number;
  quantity?: number | null;
  unit?: string | null;
}

const destinations: { platform: Platform; account: string }[] = [
  { platform: "facebook", account: "Agrivive Page" },
  { platform: "instagram", account: "Agrivive Account" },
];

function availability(quantity?: number | null, unit?: string | null) {
  if (!quantity || quantity <= 0) return null;
  return `${quantity} ${unit ?? "left"} available`;
}

/** Shows the product facts the post is built from. The words are written when the seller boosts. */
export function BoostPostPreview({ name, imageUrl, price, quantity, unit }: Props) {
  const [platform, setPlatform] = useState<Platform>("facebook");
  const stock = availability(quantity, unit);
  return (
    <View>
      <Text style={styles.label}>Where it will be posted</Text>
      <View style={styles.tabs}>
        {destinations.map((item) => {
          const active = item.platform === platform;
          return (
            <Pressable key={item.platform} onPress={() => setPlatform(item.platform)} accessibilityRole="tab"
              accessibilityState={{ selected: active }} style={[styles.tab, active && styles.tabActive]}>
              <PlatformBadge platform={item.platform} size={28} />
              <View style={styles.tabCopy}>
                <Text style={styles.tabName}>{platformName[item.platform]}</Text>
                <Text style={styles.tabAccount} numberOfLines={1}>{item.account}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.card}>
        <View style={styles.head}>
          <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
          <View style={styles.headCopy}>
            <Text style={styles.account}>Agrivive</Text>
            <View style={styles.meta}><Text style={styles.metaText}>Just now ·</Text><Globe size={12} color={colors.textMuted} /></View>
          </View>
          <MoreHorizontal size={20} color={colors.textMuted} />
        </View>
        <Text style={styles.name}>{name}</Text>
        {imageUrl ? <Image source={{ uri: imageUrl }} style={[styles.photo, platform === "instagram" && styles.square]} /> : <View style={[styles.photo, styles.square]} />}
        <View style={styles.body}>
          {stock ? <Text style={styles.stock}>{stock}</Text> : null}
          <Text style={styles.price}>₱{price.toFixed(2)}</Text>
          <Text style={styles.note}>
            {platform === "facebook" ? "We write a short message and add a link to your product page." : "We write a short caption and add your product page address."}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.textMuted, marginBottom: spacing.sm },
  tabs: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm, minHeight: 56, padding: spacing.sm, borderRadius: radii.card, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  tabActive: { borderColor: colors.primary, backgroundColor: colors.primarySurface },
  tabCopy: { flex: 1 },
  tabName: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  tabAccount: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted },
  card: { backgroundColor: colors.white, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, ...shadows.card },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.white },
  headCopy: { flex: 1 },
  account: { fontFamily: fonts.body.semiBold, fontSize: 15, color: colors.text },
  meta: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  name: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text, marginBottom: spacing.sm },
  photo: { width: "100%", aspectRatio: 1.6, borderRadius: radii.input, backgroundColor: colors.surfaceMuted },
  square: { aspectRatio: 1 },
  body: { marginTop: spacing.sm },
  stock: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
  price: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.primary, marginTop: 2 },
  note: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 17, color: colors.textMuted, marginTop: spacing.sm },
});
