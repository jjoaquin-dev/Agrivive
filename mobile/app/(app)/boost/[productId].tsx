import React, { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2, Clock3, RotateCcw, Sparkles, XCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import { fetchSellerProductBoost, requestSellerVisibilityBoost } from "../../../src/features/boost/api/visibility-boosts";
import { boostReasonLabel, boostStatusLabel, type SellerProductBoostResponse } from "../../../src/features/boost/types";
import { colors, fonts, radii, spacing } from "../../../src/theme";

export default function BoostVisibilityScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [data, setData] = useState<SellerProductBoostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError("");
    try {
      setData(await fetchSellerProductBoost(productId));
    } catch (reason: any) {
      setError(reason?.message || "Could not load the boost status.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const boost = async () => {
    if (!productId) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await requestSellerVisibilityBoost(productId);
      setMessage(response.status === "sent" ? "This listing was already sent to the social workflow." : "Your listing is waiting for the social workflow.");
      await load();
    } catch (reason: any) {
      setError(reason?.message || "Could not queue the visibility boost.");
    } finally {
      setBusy(false);
    }
  };

  const status = data?.boost?.status;
  const promptNeedsReview = status === "prompt";
  const waiting = status === "queued" || status === "sent";
  const actionTitle = promptNeedsReview ? "Review boost prompt" : status === "failed" ? "Try again" : status === "dismissed" ? "Boost again" : "Boost this listing";
  const action = promptNeedsReview ? () => router.push("/(app)/notifications") : boost;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.content}>
        <View style={styles.headingRow}>
          <View style={styles.icon}><Sparkles size={22} color={colors.primary} /></View>
          <View style={styles.headingCopy}><Text style={styles.title}>Boost Visibility</Text><Text style={styles.subtitle}>{data?.product.productName || "Your listing"}</Text></View>
        </View>
        <Text style={styles.description}>Share the current listing price, stock, photo, and product link through Agrivive's social workflow.</Text>

        {loading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
        {data?.boost ? <BoostStatusCard boost={data.boost} /> : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

        {!loading ? <ButtonComponent title={actionTitle} onPress={() => void action()} loading={busy} disabled={waiting} style={styles.action} icon={status === "failed" ? <RotateCcw size={17} color={colors.white} /> : undefined} /> : null}
        <Pressable onPress={() => router.push("/(app)/boosts")} accessibilityRole="button" style={styles.historyLink}><Text style={styles.historyLinkText}>View boost history</Text></Pressable>
        <ButtonComponent title="Back" variant="ghost" onPress={() => router.back()} style={styles.back} textStyle={styles.backText} />
      </View>
    </SafeAreaView>
  );
}

function BoostStatusCard({ boost }: { boost: NonNullable<SellerProductBoostResponse["boost"]> }) {
  const failed = boost.status === "failed";
  const tone = failed ? colors.error : boost.status === "sent" ? colors.success : colors.primary;
  const Icon = failed ? XCircle : boost.status === "sent" ? CheckCircle2 : Clock3;
  return <View style={[styles.statusCard, { borderColor: tone }]}><View style={styles.statusRow}><Icon size={20} color={tone} /><Text style={[styles.statusTitle, { color: tone }]}>{boostStatusLabel(boost.status)}</Text></View><Text style={styles.statusMeta}>{boostReasonLabel(boost.reason)} · {formatDate(boost.createdAt)}</Text>{boost.priceBefore && boost.priceAfter ? <Text style={styles.statusMeta}>Price: ₱{Number(boost.priceBefore).toFixed(2)} → ₱{Number(boost.priceAfter).toFixed(2)}</Text> : null}{boost.errorMessage ? <Text style={styles.statusError}>{boost.errorMessage}</Text> : null}</View>;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.base },
  headingRow: { flexDirection: "row", alignItems: "center" },
  icon: { width: 46, height: 46, borderRadius: 23, backgroundColor: "rgba(31, 77, 58, 0.12)", alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  headingCopy: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 28, color: colors.text },
  subtitle: { fontFamily: fonts.body.medium, fontSize: 15, color: colors.primary, marginTop: 2 },
  description: { fontFamily: fonts.body.regular, fontSize: 15, lineHeight: 22, color: colors.textMuted, marginTop: spacing.lg },
  loader: { marginTop: spacing.xl },
  statusCard: { backgroundColor: colors.surface, borderWidth: 1, borderRadius: radii.card, padding: spacing.base, marginTop: spacing.xl },
  statusRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  statusTitle: { fontFamily: fonts.body.semiBold, fontSize: 16 },
  statusMeta: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 19, color: colors.textMuted, marginTop: spacing.sm },
  statusError: { fontFamily: fonts.body.medium, fontSize: 13, lineHeight: 19, color: colors.error, marginTop: spacing.sm },
  message: { fontFamily: fonts.body.medium, fontSize: 14, lineHeight: 20, color: colors.primary, marginTop: spacing.lg },
  error: { fontFamily: fonts.body.medium, fontSize: 14, lineHeight: 20, color: colors.error, marginTop: spacing.lg },
  action: { marginTop: spacing.xl, minHeight: 48 },
  historyLink: { minHeight: 48, alignItems: "center", justifyContent: "center", marginTop: spacing.sm },
  historyLinkText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
  back: { marginTop: spacing.xs, minHeight: 44 },
  backText: { color: colors.primary, fontSize: 14, fontWeight: "700" },
});
