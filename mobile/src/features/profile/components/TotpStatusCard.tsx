import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Shield } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import { CardComponent } from "../../../components/CardComponent";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { BadgeComponent } from "../../../components/BadgeComponent";

interface Props {
  is2FAEnabled: boolean;
  isIdle: boolean;
  showDisableModal: boolean;
  onEnablePress: () => void;
  onDisablePress: () => void;
}

export function TotpStatusCard({
  is2FAEnabled,
  isIdle,
  showDisableModal,
  onEnablePress,
  onDisablePress,
}: Props) {
  return (
    <CardComponent style={styles.statusCard}>
      <View style={styles.statusHeader}>
        <View style={styles.statusTextWrapper}>
          <Text style={styles.statusTitle}>Authenticator App (TOTP)</Text>
          <Text style={styles.statusDesc}>
            {is2FAEnabled
              ? "Active. You will be required to enter a 6-digit code when signing in."
              : "Optional. Add a layer of security using Google Authenticator, Authy, or 1Password."}
          </Text>
        </View>
        <BadgeComponent
          label={is2FAEnabled ? "Enabled" : "Disabled"}
          variant={is2FAEnabled ? "success" : "neutral"}
        />
      </View>

      {!is2FAEnabled && isIdle ? (
        <ButtonComponent
          title="Enable Two-Factor Authentication"
          icon={<Shield size={16} color={colors.white} />}
          onPress={onEnablePress}
          style={styles.actionBtn}
        />
      ) : null}

      {is2FAEnabled && !showDisableModal ? (
        <ButtonComponent
          title="Disable 2FA"
          variant="destructive"
          onPress={onDisablePress}
          style={styles.actionBtn}
        />
      ) : null}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  statusCard: { marginBottom: spacing.base },
  statusHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing.base },
  statusTextWrapper: { flex: 1, marginRight: spacing.sm },
  statusTitle: { fontFamily: fonts.heading.semiBold, fontSize: 16, color: colors.text, marginBottom: 4 },
  statusDesc: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  actionBtn: { marginTop: spacing.xs },
});
