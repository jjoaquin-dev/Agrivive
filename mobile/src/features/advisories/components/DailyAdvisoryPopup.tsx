import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { AlertTriangle, CalendarDays, Thermometer, X } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { useAuth } from "../../../context/AuthContext";
import { colors, fonts, radii, spacing, touchTargets } from "../../../theme";
import { fetchSellerAdvisories } from "../api/seller-advisories";
import type { SellerAdvisoriesResponse } from "../types";
import { getWeatherConditionName, getWeatherIcon } from "./WeatherHeroCard";

// One popup each time the app opens or someone signs in. The signed-in person is remembered so it is not shown twice in a row.
let shownFor: string | null = null;

const reminderList = (data: SellerAdvisoriesResponse | null) => (data?.reminders ?? []).filter((reminder) => reminder.kind !== "location");

/** Pops up over the app: today's weather at the stall and the next holiday. Shows nothing if neither could be loaded. */
export function DailyAdvisoryPopup() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;
  const [advisories, setAdvisories] = useState<SellerAdvisoriesResponse | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId || shownFor === userId) return;
    shownFor = userId;
    let cancelled = false;
    fetchSellerAdvisories().then((data) => {
      if (cancelled) return;
      if (data.weather?.current || data.holidays.upcoming.length || reminderList(data).length) {
        setAdvisories(data);
        setOpen(true);
      }
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [userId]);

  const current = advisories?.weather?.current ?? null;
  const holiday = advisories?.holidays.upcoming[0] ?? null;
  const reminders = reminderList(advisories);
  if (!advisories) return null;

  const close = () => setOpen(false);
  const holidayDate = holiday ? new Date(`${holiday.date}T00:00:00`) : null;

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card} accessibilityViewIsModal>
          <Pressable onPress={close} accessibilityRole="button" accessibilityLabel="Close" hitSlop={8} style={styles.close}>
            <X size={20} color={colors.textMuted} />
          </Pressable>
          <Text style={styles.title}>Today at Your Stall</Text>
          {current ? (
            <View style={styles.row}>
              <View style={[styles.icon, { backgroundColor: colors.primary }]}>{getWeatherIcon(current.weatherCode, 28)}</View>
              <View style={styles.rowText}>
                <Text style={styles.big}>{Math.round(current.temperatureC)}°C · {getWeatherConditionName(current.weatherCode)}</Text>
                <Text style={styles.small}>{Math.round(current.precipitationProbability)}% chance of rain</Text>
              </View>
            </View>
          ) : null}
          {holiday && holidayDate ? (
            <View style={styles.row}>
              <View style={[styles.icon, { backgroundColor: colors.primaryLight }]}><CalendarDays size={26} color={colors.primary} /></View>
              <View style={styles.rowText}>
                <Text style={styles.big}>{holiday.name}</Text>
                <Text style={styles.small}>{holidayDate.toLocaleDateString([], { month: "long", day: "numeric" })} · Next holiday</Text>
              </View>
            </View>
          ) : null}
          {reminders.length ? (
            <View style={styles.heads} accessibilityRole="alert">
              <View style={styles.headsTitle}><AlertTriangle size={16} color="#92400E" /><Text style={styles.headsTitleText}>Heads Up</Text></View>
              {reminders.map((reminder, index) => (
                <View key={`${reminder.kind}-${index}`} style={styles.headsRow}>
                  {reminder.kind === "heat" ? <Thermometer size={16} color="#B45309" /> : reminder.kind === "holiday" ? <CalendarDays size={16} color="#B45309" /> : <AlertTriangle size={16} color="#B45309" />}
                  <Text style={styles.headsText}>{reminder.message}</Text>
                </View>
              ))}
            </View>
          ) : null}
          <ButtonComponent title="See Weather and Calendar" onPress={() => { close(); router.push("/(app)/advisories"); }} />
          <Pressable onPress={close} accessibilityRole="button" style={styles.later}><Text style={styles.laterText}>Close</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", padding: spacing.lg },
  card: { width: "100%", maxWidth: 420, backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.lg, gap: spacing.md },
  close: { position: "absolute", top: spacing.sm, right: spacing.sm, width: touchTargets.min, height: touchTargets.min, alignItems: "center", justifyContent: "center", zIndex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 20, color: colors.text, paddingRight: touchTargets.min },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  icon: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1 },
  big: { fontFamily: fonts.body.semiBold, fontSize: 16, color: colors.text },
  small: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginTop: 2 },
  heads: { backgroundColor: "#FFFBEB", borderColor: "#FDE68A", borderWidth: 1, borderRadius: radii.card, padding: spacing.md, gap: spacing.sm },
  headsTitle: { flexDirection: "row", alignItems: "center", gap: 6 },
  headsTitleText: { fontFamily: fonts.heading.semiBold, fontSize: 15, color: "#92400E" },
  headsRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  headsText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: "#78350F" },
  later: { minHeight: touchTargets.min, alignItems: "center", justifyContent: "center" },
  laterText: { fontFamily: fonts.body.medium, fontSize: 15, color: colors.textMuted },
});
