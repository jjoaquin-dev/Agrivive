import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Clock } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";

interface AuthResendTimerProps {
  seconds: number;
  sending?: boolean;
  onResend: () => void;
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

/** "Send a new code in 0:24", then a green "Send a new code" button once the wait is over. */
export const AuthResendTimer: React.FC<AuthResendTimerProps> = ({ seconds, sending, onResend }) => (
  <View style={styles.row}>
    <Clock size={16} color={colors.textMuted} />
    {seconds > 0 ? (
      <Text style={styles.text}>Send a new code in <Text style={styles.time}>{formatTime(seconds)}</Text></Text>
    ) : (
      <Pressable onPress={onResend} disabled={sending} accessibilityRole="button" hitSlop={8}>
        <Text style={styles.link}>{sending ? "Sending..." : "Send a new code"}</Text>
      </Pressable>
    )}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.sm },
  text: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted },
  time: { fontFamily: fonts.body.semiBold, color: colors.text },
  link: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.primary },
});
