import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInventory } from "../../../src/features/inventory/hooks/useInventory";
import { ActiveBoostsSection } from "../../../src/features/marketing/components/ActiveBoostsSection";
import { PriceDropsSection } from "../../../src/features/marketing/components/PriceDropsSection";
import { fetchSellerBoostPrompts } from "../../../src/features/marketing/api/visibility-boosts";
import { BoostHistorySection } from "../../../src/features/marketing/components/BoostHistorySection";
import { MarketingSectionTabs, type MarketingSection } from "../../../src/features/marketing/components/MarketingSectionTabs";
import { SocialHubBanner } from "../../../src/features/marketing/components/SocialHubBanner";
import { VisibilityGuideSection } from "../../../src/features/marketing/components/VisibilityGuideSection";
import { useBoostHistory } from "../../../src/features/marketing/hooks/useBoostHistory";
import { boostState } from "../../../src/features/marketing/types";
import { colors, spacing } from "../../../src/theme";

const activeStates = ["posting", "running", "needs_choice", "not_posted", "failed"];

const sectionFrom = (value?: string): MarketingSection =>
  value === "history" || value === "visibility" || value === "drops" ? value : "active";

/** The Marketing hub: familiar social promotions center for Facebook & Instagram (Jakob's Law). */
export default function MarketingScreen() {
  const params = useLocalSearchParams<{ section?: string }>();
  const [section, setSection] = useState<MarketingSection>(sectionFrom(params.section));
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [dropCount, setDropCount] = useState(0);
  const history = useBoostHistory();
  const { products, refresh: refreshProducts } = useInventory();

  useEffect(() => { setSection(sectionFrom(params.section)); }, [params.section]);

  useEffect(() => {
    fetchSellerBoostPrompts().then((response) => setDropCount(response.items.length)).catch(() => {});
  }, [refreshSignal, section]);

  useFocusEffect(useCallback(() => {
    void history.reload();
    setRefreshSignal((value) => value + 1);
  }, []));

  const refresh = () => {
    void history.reload();
    refreshProducts();
    setRefreshSignal((value) => value + 1);
  };

  const activeCount = history.items.filter((item) => activeStates.includes(boostState(item))).length;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        <SocialHubBanner />

        <MarketingSectionTabs value={section} activeCount={activeCount} dropCount={dropCount} onChange={setSection} />

        {section === "active" ? (
          <ActiveBoostsSection items={history.items} loading={history.loading} />
        ) : null}
        {section === "drops" ? <PriceDropsSection refreshSignal={refreshSignal} count={dropCount} /> : null}
        {section === "history" ? (
          <BoostHistorySection
            items={history.items}
            nextCursor={history.nextCursor}
            loading={history.loading}
            loadingMore={history.loadingMore}
            error={history.error}
            onRetry={history.reload}
            onLoadMore={history.loadMore}
          />
        ) : null}
        {section === "visibility" ? <VisibilityGuideSection products={products} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xxxl },
});
