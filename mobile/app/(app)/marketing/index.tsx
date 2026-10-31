import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInventory } from "../../../src/features/inventory/hooks/useInventory";
import { ActiveBoostsSection } from "../../../src/features/marketing/components/ActiveBoostsSection";
import { BoostHistorySection } from "../../../src/features/marketing/components/BoostHistorySection";
import { MarketingSectionTabs, type MarketingSection } from "../../../src/features/marketing/components/MarketingSectionTabs";
import { VisibilityGuideSection } from "../../../src/features/marketing/components/VisibilityGuideSection";
import { useBoostHistory } from "../../../src/features/marketing/hooks/useBoostHistory";
import { colors, fonts, spacing } from "../../../src/theme";

const sectionFrom = (value?: string): MarketingSection =>
  value === "history" || value === "visibility" ? value : "active";

/** The Marketing hub: what is running now, every past boost, and how high each listing shows to buyers. */
export default function MarketingScreen() {
  const params = useLocalSearchParams<{ section?: string }>();
  const [section, setSection] = useState<MarketingSection>(sectionFrom(params.section));
  const [refreshSignal, setRefreshSignal] = useState(0);
  const history = useBoostHistory();
  const { products, refresh: refreshProducts } = useInventory();

  // A link such as "View boost history" can ask for a section while the hub is already open.
  useEffect(() => { setSection(sectionFrom(params.section)); }, [params.section]);

  useFocusEffect(useCallback(() => {
    void history.reload();
    setRefreshSignal((value) => value + 1);
  }, []));

  const refresh = () => {
    void history.reload();
    refreshProducts();
    setRefreshSignal((value) => value + 1);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <View style={styles.icon}><Sparkles size={22} color={colors.primary} /></View>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Marketing</Text>
            <Text style={styles.subtitle}>Boost your listings on the Agrivive Facebook Page.</Text>
          </View>
        </View>
        <MarketingSectionTabs value={section} onChange={setSection} />
        {section === "active" ? (
          <ActiveBoostsSection items={history.items} loading={history.loading} refreshSignal={refreshSignal} />
        ) : null}
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
  header: { flexDirection: "row", alignItems: "center" },
  icon: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  headerCopy: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 24, lineHeight: 32, color: colors.text },
  subtitle: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, marginTop: 2 },
});
