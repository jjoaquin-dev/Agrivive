import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Stack, useFocusEffect } from "expo-router";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { CardComponent } from "../../src/components/CardComponent";
import { colors, fonts, spacing } from "../../src/theme";
import { fetchStall, saveStallHours, setClosedToday, type Stall, type StallDay } from "../../src/features/orders/api/seller-pickup";
import { StallHoursEditor } from "../../src/features/stall/components/StallHoursEditor";

export default function StallSetupScreen() {
  const [stall, setStall] = useState<Stall | null>(null);
  const [days, setDays] = useState<StallDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = (next: Stall) => { setStall(next); setDays(next.hours); };
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { apply(await fetchStall()); } catch (err: any) { setError(err?.message || "Could not load your stall."); } finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const change = (weekday: number, patch: Partial<StallDay>) => setDays((rows) => rows.map((row) => (row.weekday === weekday ? { ...row, ...patch } : row)));

  const save = async () => {
    setSaving(true);
    try {
      apply(await saveStallHours(days.map(({ configured: _configured, ...row }) => row)));
      Alert.alert("Saved", "Your pickup hours are saved.");
    } catch (err: any) { Alert.alert("Could Not Save", err?.message || "Please try again."); } finally { setSaving(false); }
  };

  const toggle = async (action: () => Promise<Stall>) => {
    try { apply(await action()); } catch (err: any) { Alert.alert("Could Not Change", err?.message || "Please try again."); }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (error || !stall) return <View style={styles.center}><Text style={styles.error}>{error}</Text><ButtonComponent title="Try Again" onPress={load} variant="secondary" /></View>;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "Stall Hours" }} />
      {!stall.hoursConfigured ? <Text style={styles.notice}>Buyers cannot reserve until you save your opening hours.</Text> : null}

      <CardComponent style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchText}><Text style={styles.cardTitle}>Closed today</Text><Text style={styles.hint}>Hides today's pickup times. Your weekly hours stay as they are. It turns off by itself tomorrow.</Text></View>
          <Switch value={stall.closedToday} onValueChange={(on) => void toggle(() => setClosedToday(on))} trackColor={{ true: colors.primary }} accessibilityLabel="Closed today" />
        </View>
      </CardComponent>

      <CardComponent style={styles.card}>
        <Text style={styles.cardTitle}>Opening hours</Text>
        <StallHoursEditor days={days} onChange={change} />
      </CardComponent>

      <ButtonComponent title="Save Hours" onPress={save} loading={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xxl },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.base, backgroundColor: colors.background },
  error: { fontFamily: fonts.body.medium, color: colors.error, marginBottom: spacing.md, textAlign: "center" },
  notice: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.warning, backgroundColor: "#FFF7ED", padding: spacing.md, borderRadius: 12, marginBottom: spacing.base },
  card: { marginBottom: spacing.base, borderColor: "#EEECE6", shadowOpacity: 0.02, shadowRadius: 3, elevation: 0 },
  cardTitle: { fontFamily: fonts.heading.semiBold, fontSize: 17, color: colors.text },
  hint: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 17, color: colors.textMuted, marginTop: 2 },
  switchRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  switchText: { flex: 1 },
});
