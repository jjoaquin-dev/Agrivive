import React from "react";
import { ActivityIndicator, Image, Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Check, Circle, Sparkles, Tag } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import type { SocialChannel, SocialPlatform } from "../api/social-campaigns";
import type { SellerProductBoostResponse } from "../types";

type Props = {
  productName: string;
  productUrl: string;
  imageUrl: string | null;
  channels: SocialChannel[];
  selectedPlatforms: SocialPlatform[];
  onTogglePlatform: (platform: SocialPlatform) => void;
  posts: Partial<Record<SocialPlatform, string>>;
  onChangePost: (platform: SocialPlatform, text: string) => void;
  busy: boolean;
  error: string;
  onPublish: () => void;
  pricing?: SellerProductBoostResponse["pricing"];
};

export function SocialCampaignReview(props: Props) {
  const selected = props.channels.filter((channel) => props.selectedPlatforms.includes(channel.platform));
  const previewChannel = selected[0];
  const previewText = previewChannel ? props.posts[previewChannel.platform] || "" : "Choose a channel to preview your description.";
  const openProduct = () => void Linking.openURL(props.productUrl);
  const isDiscounted = props.pricing?.hasDiscount;

  const buttonLabel = props.busy
    ? "Posting…"
    : isDiscounted && props.pricing
    ? `Post at Discounted Price (₱${props.pricing.currentPrice.toFixed(2)})`
    : "Post to Agrivive Pages";

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Preview & Confirm Post</Text>
      <Text style={styles.hint}>
        {isDiscounted
          ? "Review your discounted price and description before sharing with buyers."
          : "Review your listing details and description before sharing with buyers."}
      </Text>

      <Pressable
        onPress={openProduct}
        accessibilityRole="link"
        accessibilityLabel={`Open ${props.productName} in the marketplace`}
        style={({ pressed }) => [styles.preview, pressed && styles.pressed]}
      >
        {props.imageUrl ? (
          <Image source={{ uri: props.imageUrl }} style={styles.image} accessibilityLabel={`${props.productName} listing photo`} />
        ) : null}
        <View style={styles.previewContent}>
          <Text numberOfLines={2} style={styles.productName}>{props.productName}</Text>
          
          {props.pricing ? (
            <View style={styles.priceRow}>
              {isDiscounted ? (
                <>
                  <Text style={styles.priceOld}>₱{props.pricing.basePrice.toFixed(2)}</Text>
                  <Text style={styles.priceArrow}>→</Text>
                  <Text style={styles.priceNew}>₱{props.pricing.currentPrice.toFixed(2)}</Text>
                  <View style={styles.discountBadge}>
                    <Tag size={11} color="#EA580C" />
                    <Text style={styles.discountBadgeText}>Discounted Price</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.priceNew}>₱{props.pricing.currentPrice.toFixed(2)}</Text>
              )}
            </View>
          ) : null}

          <Text numberOfLines={4} style={styles.previewDescription}>{previewText}</Text>
          <Text style={styles.productLink}>View product in marketplace</Text>
        </View>
      </Pressable>

      <Text style={styles.sectionLabel}>Choose channels</Text>
      {props.channels.map((channel) => {
        const checked = props.selectedPlatforms.includes(channel.platform);
        return (
          <Pressable
            key={channel.platform}
            onPress={() => props.onTogglePlatform(channel.platform)}
            disabled={!channel.configured}
            accessibilityRole="checkbox"
            accessibilityState={{ checked, disabled: !channel.configured }}
            style={[styles.channelRow, !channel.configured && styles.unavailable]}
          >
            {checked ? <Check size={20} color={colors.primary} /> : <Circle size={20} color={colors.textMuted} />}
            <Text style={styles.channelName}>{channel.label}</Text>
            <Text style={styles.channelState}>{channel.configured ? "Available" : "Unavailable"}</Text>
          </Pressable>
        );
      })}

      {selected.map((channel) => (
        <View key={channel.platform} style={styles.postBlock}>
          <Text style={styles.label}>{channel.label} description</Text>
          <TextInput
            value={props.posts[channel.platform] || ""}
            onChangeText={(value) => props.onChangePost(channel.platform, value)}
            multiline
            accessibilityLabel={`${channel.label} description`}
            style={styles.input}
            textAlignVertical="top"
          />
          <Text style={[styles.count, (props.posts[channel.platform]?.length ?? 0) > channel.captionLimit && styles.error]}>
            {props.posts[channel.platform]?.length ?? 0}/{channel.captionLimit}
          </Text>
        </View>
      ))}

      {props.error ? <Text accessibilityRole="alert" style={styles.error}>{props.error}</Text> : null}

      <Pressable
        onPress={props.onPublish}
        disabled={props.busy || !props.selectedPlatforms.length}
        accessibilityRole="button"
        style={[styles.publish, (props.busy || !props.selectedPlatforms.length) && styles.disabled]}
      >
        {props.busy ? <ActivityIndicator color={colors.white} /> : <Sparkles size={17} color={colors.white} />}
        <Text style={styles.publishText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.card, padding: spacing.base, marginTop: spacing.base },
  heading: { fontFamily: fonts.heading.semiBold, fontSize: 17, color: colors.text },
  hint: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted, marginTop: spacing.xs },
  preview: { marginTop: spacing.md, borderRadius: radii.input, backgroundColor: colors.background, overflow: "hidden", borderWidth: 1, borderColor: colors.border },
  image: { width: "100%", height: 180, resizeMode: "cover" },
  previewContent: { padding: spacing.md },
  productName: { fontFamily: fonts.body.semiBold, fontSize: 16, color: colors.text },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4, marginBottom: spacing.xs },
  priceOld: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, textDecorationLine: "line-through" },
  priceArrow: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.textMuted },
  priceNew: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.primary },
  discountBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#FFEDD5", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  discountBadgeText: { fontFamily: fonts.body.semiBold, fontSize: 11, color: "#EA580C" },
  previewDescription: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted, marginTop: 4 },
  productLink: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.primary, marginTop: spacing.sm },
  sectionLabel: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.xs },
  channelRow: { minHeight: touchTargets.min, flexDirection: "row", alignItems: "center", gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  channelName: { flex: 1, fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  channelState: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.success },
  unavailable: { opacity: 0.55 },
  postBlock: { marginTop: spacing.md },
  label: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text, marginBottom: spacing.xs },
  input: { minHeight: 104, borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, padding: spacing.md, color: colors.text, fontFamily: fonts.body.regular, fontSize: 14, backgroundColor: colors.background },
  count: { fontFamily: fonts.body.regular, fontSize: 11, color: colors.textMuted, textAlign: "right", marginTop: 3 },
  error: { color: colors.error, fontFamily: fonts.body.medium, fontSize: 13, marginTop: spacing.md },
  publish: { minHeight: 52, backgroundColor: colors.primary, borderRadius: radii.button, marginTop: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm },
  publishText: { color: colors.white, fontFamily: fonts.body.semiBold, fontSize: 15 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.78 },
});
