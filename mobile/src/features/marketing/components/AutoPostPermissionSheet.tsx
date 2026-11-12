import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Repeat2, Settings } from "lucide-react-native";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { colors, fonts, radii, spacing } from "../../../theme";
import { SlideModal } from "../../../components/SlideModal";

interface Props {
  visible: boolean;
  busy: boolean;
  error: string;
  onAccept: () => void;
  onDecline: () => void;
}

/** Asked once after produce is added. Only the first post is yours to start; this covers every post after it. */
export function AutoPostPermissionSheet({ visible, busy, error, onAccept, onDecline }: Props) {
  return (
    <SlideModal visible={visible} onRequestClose={onDecline} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={busy ? undefined : onDecline} accessibilityLabel="Close" />
      <View style={styles.sheet} accessibilityViewIsModal>
        <View style={styles.handle} />
        <View style={styles.iconWrap}><Repeat2 size={32} color={colors.primary} /></View>
        <Text style={styles.title}>Let Agrivive post for you?</Text>
        <Text style={styles.text}>You start the first post yourself. If you say yes, we post again for this produce on the Agrivive Facebook and Instagram pages after that.</Text>
        <View style={styles.list}>
          <Text style={styles.item}>• 6 hours after your post, we lower the price and post the new price. This follows your drop amount and final price.</Text>
          <Text style={styles.item}>• When this produce ranks high again, we post it again.</Text>
        </View>
        <View style={styles.how}>
          <Settings size={18} color={colors.textMuted} />
          <Text style={styles.howText}>To turn it off: open Boost, tap the Settings icon, then switch off Auto-Post for this produce. You can do this any time.</Text>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ButtonComponent title="Yes, Auto-Post" onPress={onAccept} loading={busy} style={styles.primary} />
        <ButtonComponent title="Not Now" variant="ghost" onPress={onDecline} disabled={busy} style={styles.secondary} />
      </View>
    </SlideModal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1 },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingTop: spacing.md, paddingBottom: spacing.xl },
  handle: { alignSelf: "center", width: 40, height: 6, borderRadius: 4, backgroundColor: colors.border, marginBottom: spacing.md },
  iconWrap: { alignSelf: "center", width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  title: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text, textAlign: "center" },
  text: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs, marginBottom: spacing.md },
  list: { gap: spacing.xs, marginBottom: spacing.md },
  item: { fontFamily: fonts.body.regular, fontSize: 14, lineHeight: 20, color: colors.text },
  how: { flexDirection: "row", gap: spacing.sm, backgroundColor: colors.surfaceMuted, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  howText: { flex: 1, fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted },
  error: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.error, marginBottom: spacing.sm },
  primary: { minHeight: 52 },
  secondary: { minHeight: 48, marginTop: spacing.xs },
});
