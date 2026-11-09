import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Stack, useFocusEffect } from "expo-router";
import { Minus, Plus } from "lucide-react-native";
import { ButtonComponent } from "../../src/components/ButtonComponent";
import { CardComponent } from "../../src/components/CardComponent";
import { colors, fonts, spacing, touchTargets } from "../../src/theme";
import { Pressable } from "react-native";
import { fetchStall, saveStallHours, saveStallSettings, setAwayMode, setClosedToday, type Stall, type StallDay } from "../../src/features/orders/api/seller-pickup";
import { StallHoursEditor } from "../../src/features/stall/components/StallHoursEditor";

export default function StallSetupScreen() {
  const [stall, setStall] = useState<Stall | null>(null);
  const [days, setDays] = useState<StallDay[]>([]);
  const [capacity, setCapacity] = useState(3);
  const [within, setWithin] = useState(120);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = (next: Stall) => { setStall(next); setDays(next.hours); setCapacity(next.pickupCapacity); setWithin(next.pickupWithinMinutes); };
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { apply(await fetchStall()); } catch (err: any) { setError(err?.message || "Could not load your stall."); } finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const change = (weekday: number, patch: Partial<StallDay>) => setDays((rows) => rows.map((row) => (row.weekday === weekday ? { ...row, ...patch } : row)));

  const save = async () => {
    setSaving(true);
    try {
      await saveStallHours(days.map(({ configured: _configured, ...row }) => row));
      apply(await saveStallSettings({ pickupCapacity: capacity, pickupWithinMinutes: within }));
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
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.cardTitle}>Away</Text>
            <Text style={styles.hint}>Tells buyers you cannot reply. Your 48-hour reply clock stops. Orders, pickup times and QR codes do not change. Lasts up to 14 days.</Text>
            {stall.away.active && stall.away.until ? <Text style={styles.active}>On until {new Date(stall.away.until).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</Text> : null}
          </View>
          <Switch value={stall.away.active} onValueChange={(on) => void toggle(() => setAwayMode(on, 14))} trackColor={{ true: colors.primary }} accessibilityLabel="Away" />
        </View>
      </CardComponent>

      <CardComponent style={styles.card}>
        <Text style={styles.cardTitle}>Opening hours</Text>
        <StallHoursEditor days={days} onChange={change} />
      </CardComponent>

      <CardComponent style={styles.card}>
        <Text style={styles.cardTitle}>Pickup limits</Text>
        <Text style={styles.label}>Buyers at the same time</Text>
        <View style={styles.limitRow}>
          <Pressable accessibilityRole="button" accessibilityLabel="Fewer buyers" onPress={() => setCapacity((c) => Math.max(1, c - 1))} style={styles.stepButton}><Minus size={16} color={colors.primary} /></Pressable>
          <Text style={styles.stepValue}>{capacity}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="More buyers" onPress={() => setCapacity((c) => Math.min(50, c + 1))} style={styles.stepButton}><Plus size={16} color={colors.primary} /></Pressable>
        </View>
        <Text style={styles.label}>Pick up within (longest range a buyer can choose)</Text>
        <View style={styles.limitRow}>
          <Pressable accessibilityRole="button" accessibilityLabel="Shorter range" onPress={() => setWithin((w) => Math.max(15, w - 15))} style={styles.stepButton}><Minus size={16} color={colors.primary} /></Pressable>
          <Text style={styles.stepValue}>{within} min</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Longer range" onPress={() => setWithin((w) => Math.min(480, w + 15))} style={styles.stepButton}><Plus size={16} color={colors.primary} /></Pressable>
        </View>
        <Text style={styles.hint}>Buyers cannot book the last 30 minutes before you close.</Text>
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
  card: { marginBottom: spacing.base },
  cardTitle: { fontFamily: fonts.heading.semiBold, fontSize: 17, color: colors.text },
  hint: { fontFamily: fonts.body.regular, fontSize: 12, lineHeight: 17, color: colors.textMuted, marginTop: 2 },
  active: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.primary, marginTop: spacing.xs },
  label: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.text, marginTop: spacing.md },
  switchRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  switchText: { flex: 1 },
  stepButton: { width: touchTargets.min, height: touchTargets.min, borderRadius: touchTargets.min / 2, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  stepValue: { minWidth: 72, textAlign: "center", fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  limitRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.xs },
});
