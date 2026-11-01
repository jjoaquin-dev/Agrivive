import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle2, XCircle } from "lucide-react-native";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { fetchSellerProductBoost } from "../../../src/features/marketing/api/visibility-boosts";
import { BoostChannelList } from "../../../src/features/marketing/components/BoostChannelList";
import type { SellerProductBoostResponse } from "../../../src/features/marketing/types";
import { colors, fonts, radii, spacing } from "../../../src/theme";

const pollEveryMs = 4_000, pollTimes = 45;

export default function BoostStartedScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [data, setData] = useState<SellerProductBoostResponse | null>(null);
  const [checkFailed, setCheckFailed] = useState(false);

  // The boost is posted in the background, so ask for each platform's real answer until both have one.
  useEffect(() => {
    if (!productId) return;
    let stop = false, tries = 0;
    const tick = async () => {
      try {
        const next = await fetchSellerProductBoost(productId);
        if (stop) return;
        setData(next);
        setCheckFailed(false);
        const channels = next.boost?.channels;
        const pending = !channels || [channels.facebook, channels.instagram].some((c) => c.status === "waiting" || c.status === "posting");
        if (!pending) return;
      } catch { if (!stop) setCheckFailed(true); }
      if (!stop && ++tries < pollTimes) setTimeout(() => void tick(), pollEveryMs);
    };
    void tick();
    return () => { stop = true; };
  }, [productId]);

  const channels = data?.boost?.channels;
  const states = channels ? [channels.facebook.status, channels.instagram.status] : [];
  const allFailed = states.length === 2 && states.every((s) => s === "failed");
  const someFailed = states.includes("failed");
  const dropAmount = data?.product.priceReductionAmount ?? 0;
  const next = ["Your post reaches more buyers.", "Buyers can open your product page.",
    dropAmount > 0 ? "If it does not sell, the price drops every 6 hours until your final price." : "Your price stays the same."];
  const Icon = allFailed ? XCircle : CheckCircle2;

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <View style={[styles.badge, allFailed && styles.badgeBad]}><Icon size={64} color={allFailed ? colors.error : colors.primary} /></View>
    <Text style={styles.title}>{allFailed ? "Your boost did not post" : "Your boost has started!"}</Text>
    <Text style={styles.text}>
      {allFailed ? "Neither page took the post. You can try again from your produce."
        : someFailed ? "Your boost started, but one page did not take the post."
        : "Your produce is being shared on the Agrivive Facebook and Instagram pages."}
    </Text>
    <BoostChannelList channels={channels} />
    {checkFailed ? <Text accessibilityRole="alert" style={styles.warn}>We could not check the posts just now. We will try again.</Text> : null}
    {allFailed ? null : <View style={styles.next}>
      <Text style={styles.nextTitle}>What happens now</Text>
      {next.map((line, index) => <View key={line} style={styles.step}>
        <View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View>
        <Text style={styles.stepText}>{line}</Text>
      </View>)}
    </View>}
    <ButtonComponent title="View My Produce" onPress={() => router.replace(`/(app)/inventory/${productId}`)} style={styles.action} />
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxxl },
  badge: { alignSelf: "center", width: 120, height: 120, borderRadius: 60, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  badgeBad: { backgroundColor: "rgba(220,38,38,0.08)" },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text, textAlign: "center", marginTop: spacing.lg },
  text: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22, color: colors.textMuted, textAlign: "center", marginTop: spacing.sm, marginBottom: spacing.lg },
  warn: { fontFamily: fonts.body.medium, fontSize: 13, color: colors.warning, marginTop: spacing.sm },
  next: { backgroundColor: colors.primarySurface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.primaryLight, padding: spacing.base, marginTop: spacing.base },
  nextTitle: { fontFamily: fonts.heading.bold, fontSize: 17, color: colors.text, marginBottom: spacing.sm },
  step: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.sm },
  number: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  numberText: { fontFamily: fonts.heading.bold, fontSize: 13, color: colors.white },
  stepText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.text },
  action: { marginTop: spacing.xl, minHeight: 52 },
});
