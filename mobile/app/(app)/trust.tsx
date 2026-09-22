import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertCircle, CheckCircle2, ShieldCheck, X } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { colors, fonts, radii, spacing, touchTargets } from "../../src/theme";
import { useSellerTrust } from "../../src/features/trust/hooks/useSellerTrust";
import type { SellerTrustEvent, SellerTrustNotice } from "../../src/features/trust/types";

function trustLabel(kind: string) {
  return kind.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function dateLabel(value: string) {
  return new Date(value).toLocaleString();
}

export default function SellerTrustScreen() {
  const { trust, loading, refreshing, error, refresh, requestCorrection } = useSellerTrust();
  const [selectedEvent, setSelectedEvent] = useState<SellerTrustEvent | null>(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submitCorrection = async () => {
    if (!selectedEvent) return;
    if (reason.trim().length < 5) {
      setReasonError("Please explain the correction in at least 5 characters.");
      return;
    }
    setSaving(true);
    setReasonError(null);
    try {
      await requestCorrection(selectedEvent.id, reason.trim());
      setSelectedEvent(null);
      setReason("");
    } catch (err: any) {
      setReasonError(err?.message || "Could not submit the correction.");
    } finally {
      setSaving(false);
    }
  };

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
            <Text style={styles.title}>Trust history</Text>
            <Text style={styles.muted}>Verified account events and notices connected to your seller activity.</Text>
          </View>
        </View>

        {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text><ButtonComponent title="Try Again" onPress={refresh} variant="secondary" style={styles.retryButton} /></View> : null}

        <Text style={styles.sectionTitle}>Verified events</Text>
        {trust.events.length === 0 ? (
          <View style={styles.emptyCard}><CheckCircle2 size={22} color={colors.success} /><Text style={styles.muted}>No verified trust events yet.</Text></View>
        ) : trust.events.map((event) => (
          <View key={event.id} style={styles.card}>
            <View style={styles.cardIcon}><CheckCircle2 size={19} color={colors.success} /></View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{trustLabel(event.kind)}</Text>
              <Text style={styles.cardMeta}>Order {event.orderId.slice(0, 8)} · {dateLabel(event.createdAt)}</Text>
              <Pressable onPress={() => { setSelectedEvent(event); setReasonError(null); }} accessibilityRole="button" accessibilityLabel={`Request a correction for ${trustLabel(event.kind)}`} style={styles.correctionButton}>
                <Text style={styles.correctionText}>Request correction</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Notices</Text>
        {trust.notices.length === 0 ? (
          <View style={styles.emptyCard}><AlertCircle size={22} color={colors.textMuted} /><Text style={styles.muted}>No trust notices yet.</Text></View>
        ) : trust.notices.map((notice: SellerTrustNotice) => (
          <View key={notice.id} style={styles.card}>
            <View style={styles.cardIcon}><AlertCircle size={19} color={colors.warning} /></View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{trustLabel(notice.kind)}</Text>
              <Text style={styles.cardMeta}>Order {notice.orderId.slice(0, 8)} · {dateLabel(notice.createdAt)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={Boolean(selectedEvent)} transparent animationType="slide" onRequestClose={() => setSelectedEvent(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Request correction</Text><Pressable onPress={() => setSelectedEvent(null)} accessibilityRole="button" accessibilityLabel="Close correction form" style={styles.closeButton}><X size={22} color={colors.textMuted} /></Pressable></View>
            <Text style={styles.muted}>Explain what should be checked again.</Text>
            <TextInput value={reason} onChangeText={(value) => { setReason(value); setReasonError(null); }} placeholder="Reason" placeholderTextColor={colors.textMuted} multiline accessibilityLabel="Correction reason" style={[styles.input, reasonError && styles.inputError]} />
            {reasonError ? <Text style={styles.fieldError}>{reasonError}</Text> : null}
            <ButtonComponent title="Submit correction" onPress={submitCorrection} loading={saving} disabled={!reason.trim()} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xxxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  introCard: { flexDirection: "row", alignItems: "flex-start", backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.lg },
  introText: { flex: 1, marginLeft: spacing.md },
  title: { fontFamily: fonts.heading.bold, fontSize: 24, color: colors.text, marginBottom: spacing.xs },
  muted: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted },
  sectionTitle: { fontFamily: fonts.heading.semiBold, fontSize: 18, color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  card: { flexDirection: "row", alignItems: "flex-start", backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, marginBottom: spacing.sm },
  cardIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  cardBody: { flex: 1 },
  cardTitle: { fontFamily: fonts.body.semiBold, fontSize: 16, lineHeight: 22, color: colors.text },
  cardMeta: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 18, color: colors.textMuted, marginTop: spacing.xs },
  correctionButton: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start", marginTop: spacing.xs },
  correctionText: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
  emptyCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.base, gap: spacing.sm },
  errorBox: { backgroundColor: "rgba(184, 84, 80, 0.1)", borderWidth: 1, borderColor: colors.error, borderRadius: radii.card, padding: spacing.md, marginBottom: spacing.base },
  errorText: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.error },
  retryButton: { marginTop: spacing.sm },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" },
  modalCard: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, padding: spacing.base, paddingBottom: spacing.xl },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xs },
  modalTitle: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text },
  closeButton: { minWidth: touchTargets.min, minHeight: touchTargets.min, alignItems: "center", justifyContent: "center" },
  input: { minHeight: 112, borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, padding: spacing.md, marginVertical: spacing.base, color: colors.text, fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, textAlignVertical: "top" },
  inputError: { borderColor: colors.error },
  fieldError: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.error, marginTop: -spacing.base, marginBottom: spacing.sm },
});
