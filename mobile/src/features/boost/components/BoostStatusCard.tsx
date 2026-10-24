import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CheckCircle2, Clock3, XCircle } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { boostReasonLabel, boostStatusLabel, type SellerProductBoostResponse } from "../types";

interface Props {
  boost: NonNullable<SellerProductBoostResponse["boost"]>;
}

export function BoostStatusCard({ boost }: Props) {
  const failed = boost.status === "failed";
  const tone = failed ? colors.error : boost.status === "sent" ? colors.success : colors.primary;
  const Icon = failed ? XCircle : boost.status === "sent" ? CheckCircle2 : Clock3;
  const formatDate = (v: string) =>
    new Date(v).toLocaleString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <View style={[styles.statusCard, { borderColor: tone }]}>
      <View style={styles.statusRow}>
        <Icon size={20} color={tone} />
        <Text style={[styles.statusTitle, { color: tone }]}>{boostStatusLabel(boost.status)}</Text>
      </View>
      <Text style={styles.statusMeta}>
        {boostReasonLabel(boost.reason)} · {formatDate(boost.createdAt)}
      </Text>
      {boost.priceBefore && boost.priceAfter ? (
        <Text style={styles.statusMeta}>
          Price: ₱{Number(boost.priceBefore).toFixed(2)} → ₱{Number(boost.priceAfter).toFixed(2)}
        </Text>
      ) : null}
      {boost.errorMessage ? <Text style={styles.statusError}>{boost.errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  statusCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radii.card,
    padding: spacing.base,
    marginTop: spacing.base,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  statusTitle: { fontFamily: fonts.body.semiBold, fontSize: 16 },
  statusMeta: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  statusError: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    lineHeight: 19,
    color: colors.error,
    marginTop: spacing.sm,
  },
});
