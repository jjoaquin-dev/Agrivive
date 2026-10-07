import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { CheckCheck, Megaphone, Share2 } from "lucide-react-native";
import { ApiError } from "../../../api/client";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import { useSellerPromotions } from "../hooks/useSellerPromotions";
import { getSellerPromotionShare } from "../api/seller-promotions";
import type { SellerPromotion } from "../types";

function PromotionCard({ item, busy, unavailable, onShare, onRead }: {
  item: SellerPromotion;
  busy: boolean;
  unavailable: boolean;
  onShare: () => void;
  onRead: () => void;
}) {
  const unread = !item.readAt;
  return (
    <View style={[styles.card, unread && styles.unreadCard]}>
      <View style={styles.cardTop}>
        <View style={styles.stageIcon}><Megaphone size={18} color={colors.primary} /></View>
        <View style={styles.cardHeading}>
          <Text style={styles.stage}>{item.stage === "followup" ? "Follow-up draft" : "Initial draft"}</Text>
          <Text style={styles.productName}>{item.productName}</Text>
        </View>
        {unread ? <View style={styles.unreadDot} accessible accessibilityLabel="Unread" /> : null}
      </View>
      {item.headline ? <Text style={styles.headline}>{item.headline}</Text> : null}
      {item.caption ? <Text style={styles.caption}>{item.caption}</Text> : null}
      <Text style={styles.date}>{new Date(item.readyAt ?? item.createdAt).toLocaleString()}</Text>
      {unavailable ? <Text style={styles.unavailable}>This listing is no longer eligible to share.</Text> : null}
      <View style={styles.actions}>
        <Pressable onPress={onShare} disabled={busy || unavailable} accessibilityRole="button"
          accessibilityLabel={`Share ${item.productName} listing`}
          style={({ pressed }) => [styles.shareButton, (busy || unavailable) && styles.disabled, pressed && styles.pressed]}>
          {busy ? <ActivityIndicator color={colors.white} /> : <Share2 size={17} color={colors.white} />}
          <Text style={styles.shareText}>{unavailable ? "Unavailable" : busy ? "Preparing" : "Share listing"}</Text>
        </Pressable>
        {unread ? (
          <Pressable onPress={onRead} disabled={busy} accessibilityRole="button"
            accessibilityLabel="Mark promotion draft as read" style={({ pressed }) => [styles.readButton, pressed && styles.pressed]}>
            <CheckCheck size={16} color={colors.primary} />
            <Text style={styles.readText}>Mark read</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export function SellerPromotionInboxSection({ refreshSignal }: { refreshSignal: number }) {
  const { items, nextCursor, unreadCount, loading, refreshing, loadingMore, error, refresh, loadMore, markRead, markAllRead } = useSellerPromotions();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [unavailableIds, setUnavailableIds] = useState<string[]>([]);

  useEffect(() => { if (refreshSignal > 0) refresh(); }, [refreshSignal]);

  const share = async (item: SellerPromotion) => {
    setBusyId(item.id);
    try {
      if (!item.readAt) {
        try { await markRead(item.id); }
        catch { Alert.alert("Could Not Update", "The draft could not be marked as read."); }
      }
      const payload = await getSellerPromotionShare(item.id);
      await Share.share({ message: payload.message, url: payload.shareUrl, title: payload.title });
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode === 409) {
        setUnavailableIds((previous) => previous.includes(item.id) ? previous : [...previous, item.id]);
      } else {
        Alert.alert("Could Not Share", error?.message || "Please try again.");
      }
    } finally {
      setBusyId(null);
    }
  };

  const readAll = async () => {
    try { await markAllRead(); }
    catch (error: any) { Alert.alert("Could Not Update", error?.message || "Please try again."); }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleWrap}>
          <Text style={styles.sectionTitle}>Priority Boost</Text>
          <Text style={styles.sectionSubtitle}>
            {unreadCount ? `${unreadCount} unread draft${unreadCount === 1 ? "" : "s"}` : "Drafts for your review"}
          </Text>
        </View>
        {unreadCount > 0 ? (
          <Pressable onPress={readAll} accessibilityRole="button" accessibilityLabel="Mark all promotion drafts as read" style={styles.markAll}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={refresh} accessibilityRole="button" style={styles.retryButton}><Text style={styles.retryText}>Try again</Text></Pressable>
        </View>
      ) : null}
      {loading && !refreshing && items.length === 0 ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
      {!loading && !error && items.length === 0 ? <Text style={styles.empty}>No promotion drafts yet.</Text> : null}
      {items.map((item) => (
        <PromotionCard key={item.id} item={item} busy={busyId === item.id}
          unavailable={unavailableIds.includes(item.id)} onShare={() => void share(item)}
          onRead={() => void markRead(item.id).catch((err: any) => Alert.alert("Could Not Update", err?.message || "Please try again."))} />
      ))}
      {nextCursor ? (
        <Pressable onPress={loadMore} disabled={loadingMore} accessibilityRole="button" style={styles.loadMore}>
          {loadingMore ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.loadMoreText}>Load more drafts</Text>}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.base, marginBottom: spacing.lg },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.sm },
  sectionTitleWrap: { flex: 1 },
  sectionTitle: { fontFamily: fonts.heading.bold, fontSize: 19, color: colors.text },
  sectionSubtitle: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  markAll: { minHeight: touchTargets.min, justifyContent: "center", paddingHorizontal: spacing.sm },
  markAllText: { fontFamily: fonts.body.semiBold, color: colors.primary, fontSize: 12 },
  card: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.sm },
  unreadCard: { borderColor: colors.primary, backgroundColor: "rgba(31, 77, 58, 0.04)" },
  cardTop: { flexDirection: "row", alignItems: "center" },
  stageIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(31, 77, 58, 0.08)", alignItems: "center", justifyContent: "center", marginRight: spacing.sm },
  cardHeading: { flex: 1 },
  stage: { fontFamily: fonts.body.semiBold, color: colors.primary, fontSize: 13 },
  productName: { fontFamily: fonts.body.medium, color: colors.text, fontSize: 14, marginTop: 2 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: spacing.sm },
  headline: { fontFamily: fonts.body.semiBold, color: colors.text, fontSize: 16, lineHeight: 22, marginTop: spacing.md },
  caption: { fontFamily: fonts.body.regular, color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: spacing.xs },
  date: { fontFamily: fonts.body.regular, color: colors.textMuted, fontSize: 12, marginTop: spacing.sm },
  unavailable: { fontFamily: fonts.body.medium, color: colors.error, fontSize: 13, marginTop: spacing.sm },
  actions: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md },
  shareButton: { minHeight: 48, flex: 1, borderRadius: radii.button, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, paddingHorizontal: spacing.md },
  shareText: { fontFamily: fonts.body.semiBold, color: colors.white, fontSize: 14 },
  disabled: { opacity: 0.55 },
  readButton: { minHeight: 44, borderRadius: radii.button, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.sm, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs },
  readText: { fontFamily: fonts.body.medium, color: colors.primary, fontSize: 12 },
  pressed: { opacity: 0.75 },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md },
  errorText: { fontFamily: fonts.body.regular, color: colors.error, fontSize: 14, lineHeight: 20 },
  retryButton: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: spacing.sm, marginTop: spacing.xs },
  retryText: { fontFamily: fonts.body.semiBold, color: colors.primary, fontSize: 14 },
  loader: { marginVertical: spacing.md },
  empty: { fontFamily: fonts.body.regular, color: colors.textMuted, fontSize: 14, paddingVertical: spacing.sm },
  loadMore: { minHeight: 48, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radii.button, alignItems: "center", justifyContent: "center" },
  loadMoreText: { fontFamily: fonts.body.semiBold, color: colors.primary, fontSize: 14 },
});
