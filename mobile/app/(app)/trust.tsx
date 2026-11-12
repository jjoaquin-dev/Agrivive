import React from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { colors, fonts, radii, spacing, typography } from "../../src/theme";
import { useSellerTrust } from "../../src/features/trust/hooks/useSellerTrust";
import type { SellerTrustAction, SellerTrustNotice } from "../../src/features/trust/types";
import { TrustStandingCard } from "../../src/features/trust/components/TrustStandingCard";
import { formatDateTime } from "../../src/utils/dates";

function trustLabel(kind: string) {
  return kind.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function SellerTrustScreen() {
  const { trust, loading, refreshing, error, refresh } = useSellerTrust();
  const activeActions = (trust.actions ?? []).filter((action: SellerTrustAction) =>
    !action.revokedAt && (!action.endsAt || new Date(action.endsAt) > new Date()),
  );

  if (loading && !refreshing) {
    return <SafeAreaView style={styles.safeArea} edges={["bottom"]}><View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.muted}>Loading trust history...</Text></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        <View style={styles.introCard}>
          <ShieldCheck size={24} color={colors.primary} />
          <View style={styles.introText}>
            <Text style={styles.title}>Trust History</Text>
            <Text style={styles.muted}>Your level, what counted, and notices about your seller activity.</Text>
          </View>
        </View>

        {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text><ButtonComponent title="Try Again" onPress={refresh} variant="secondary" style={styles.retryButton} /></View> : null}

        <TrustStandingCard />

        {activeActions.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Current account actions</Text>
            {activeActions.map((action) => (
              <View key={action.id} style={styles.actionCard}>
                <AlertCircle size={20} color={colors.warning} />
                <View style={styles.actionBody}>
                  <Text style={styles.cardTitle}>{trustLabel(action.actionType)}</Text>
                  <Text style={styles.cardMeta}>{action.reason}</Text>
                  {action.endsAt ? <Text style={styles.cardMeta}>Ends {formatDateTime(action.endsAt)}</Text> : null}
                </View>
              </View>
            ))}
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Notices</Text>
        {trust.notices.length === 0 ? (
          <View style={styles.emptyCard}><CheckCircle2 size={24} color={colors.success} /><Text style={styles.muted}>No trust notices yet.</Text></View>
        ) : trust.notices.map((notice: SellerTrustNotice) => (
          <View key={notice.id} style={styles.card}>
            <View style={styles.cardIcon}><AlertCircle size={20} color={colors.warning} /></View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{trustLabel(notice.kind)}</Text>
              <Text style={styles.cardMeta}>{formatDateTime(notice.createdAt)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xxxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  introCard: { flexDirection: "row", alignItems: "flex-start", backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.lg },
  introText: { flex: 1, marginLeft: spacing.md },
  title: { ...typography.screenTitle, color: colors.text, marginBottom: spacing.xs },
  muted: { ...typography.body, color: colors.textMuted },
  sectionTitle: { ...typography.sectionHeading, color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  card: { flexDirection: "row", alignItems: "flex-start", backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.sm },
  actionCard: { flexDirection: "row", alignItems: "flex-start", backgroundColor: colors.primarySurface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.warning, padding: spacing.base, marginBottom: spacing.sm },
  actionBody: { flex: 1, marginLeft: spacing.md },
  cardIcon: { width: 40, height: 40, borderRadius: radii.full, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  cardBody: { flex: 1 },
  cardTitle: { fontFamily: fonts.body.semiBold, fontSize: 16, lineHeight: 22, color: colors.text },
  cardMeta: { ...typography.labelSmall, color: colors.textMuted, marginTop: spacing.xs },
  emptyCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, gap: spacing.sm },
  errorBox: { backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginBottom: spacing.base },
  errorText: { ...typography.body, color: colors.error },
  retryButton: { marginTop: spacing.sm },
});
