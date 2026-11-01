import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Megaphone } from "lucide-react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonComponent } from "../../../src/components/ButtonComponent";
import {
  fetchSellerProductBoost, requestSellerVisibilityBoost,
} from "../../../src/features/marketing/api/visibility-boosts";
import { BoostEligibilityNote } from "../../../src/features/marketing/components/BoostEligibilityNote";
import { BoostProductHeader } from "../../../src/features/marketing/components/BoostProductHeader";
import { BoostPostPreview } from "../../../src/features/marketing/components/BoostPostPreview";
import { BoostPriceDropCard } from "../../../src/features/marketing/components/BoostPriceDropCard";
import { BoostStatusCard } from "../../../src/features/marketing/components/BoostStatusCard";
import { PriceDropRuleCard } from "../../../src/features/marketing/components/PriceDropRuleCard";
import { PriceDropSetupSheet } from "../../../src/features/marketing/components/PriceDropSetupSheet";
import type { SellerProductBoostResponse } from "../../../src/features/marketing/types";
import { colors, fonts, spacing } from "../../../src/theme";

export default function PreviewBoostScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const [data, setData] = useState<SellerProductBoostResponse | null>(null);
  const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const [setupOpen, setSetupOpen] = useState(false);
  const sending = useRef(false);

  const load = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try { setData(await fetchSellerProductBoost(productId)); setError(""); }
    catch (reason: any) { setError(reason?.message || "Could not load the post. Check your connection and try again."); }
    finally { setLoading(false); }
  }, [productId]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const boost = async () => {
    // A second tap while the first is still going must not start a second boost.
    if (!productId || sending.current) return;
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      await requestSellerVisibilityBoost(productId);
      router.replace(`/(app)/marketing/started?productId=${productId}`);
    } catch (reason: any) {
      setError(reason?.message || "Could not post. Check your connection and try again.");
      sending.current = false;
      setBusy(false);
    }
  };

  const product = data?.product;
  const canBoost = data?.eligibility.canBoost ?? false;
  const waitHours = data?.eligibility.waitUntil
    ? Math.max(1, Math.ceil((new Date(data.eligibility.waitUntil).getTime() - Date.now()) / 3_600_000))
    : 0;

  return <SafeAreaView style={styles.safe} edges={["bottom"]}><ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
    {loading && !data ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
    {product && canBoost ? <BoostPostPreview name={product.productName} imageUrl={product.imageUrl} price={product.currentPrice} quantity={product.quantity} unit={product.unit} /> : null}
    {product && data && canBoost ? <BoostPriceDropCard dropAmount={product.priceReductionAmount} lowestPrice={product.lowestPrice} /> : null}
    {product && data && !canBoost ? <BoostProductHeader name={product.productName} imageUrl={product.imageUrl} price={product.currentPrice} unit={product.unit} /> : null}
    {data ? <BoostEligibilityNote canBoost={canBoost} headline={data.eligibility.headline} message={data.eligibility.message} /> : null}
    {!canBoost && data?.boost ? <BoostStatusCard boost={data.boost} /> : null}
    {data?.priceDropRule ? <PriceDropRuleCard rule={data.priceDropRule} onSetUp={() => setSetupOpen(true)} /> : null}
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </ScrollView>
  <View style={styles.bar}>
    {data ? <ButtonComponent title={waitHours > 0 ? `Post again in about ${waitHours} hour${waitHours === 1 ? "" : "s"}` : "Post on Facebook & Instagram"} onPress={() => void boost()} loading={busy} disabled={!canBoost} icon={<Megaphone size={18} color={colors.white} />} style={styles.action} /> : null}
    {!data && error ? <ButtonComponent title="Try Again" variant="secondary" onPress={() => void load()} style={styles.action} /> : null}
    <Pressable onPress={() => router.push("/(app)/(tabs)/marketing?section=history")} accessibilityRole="button" style={styles.historyLink}><Text style={styles.historyLinkText}>See boost history</Text></Pressable>
  </View>
  {product ? <PriceDropSetupSheet visible={setupOpen} productId={product.id} price={product.currentPrice} onClose={() => setSetupOpen(false)} onSaved={() => { setSetupOpen(false); void load(); }} /> : null}
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  bar: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.base, paddingTop: spacing.md },
  loader: { marginTop: spacing.md },
  error: { color: colors.error, fontFamily: fonts.body.medium, fontSize: 14, lineHeight: 20, marginTop: spacing.md },
  action: { minHeight: 52 },
  historyLink: { minHeight: 48, alignItems: "center", justifyContent: "center" },
  historyLinkText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
});
