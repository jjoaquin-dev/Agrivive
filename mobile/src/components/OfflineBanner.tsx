import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetworkState } from "expo-network";
import { WifiOff } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../theme";

/** A small notice when the phone has no internet, so a failed load is not a surprise (Visibility of System Status, Jakob Nielsen). */
export function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const network = useNetworkState();
  // Unknown (null) counts as online: only say offline when the phone reports it.
  const offline = network.isConnected === false || network.isInternetReachable === false;
  if (!offline) return null;
  return (
    <View pointerEvents="none" style={[styles.wrap, { top: insets.top + spacing.xs }]} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <View style={styles.pill}>
        <WifiOff size={14} color={colors.white} />
        <Text style={styles.text}>No internet. Some screens may not load.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 0, right: 0, alignItems: "center", zIndex: 50 },
  pill: { flexDirection: "row", alignItems: "center", gap: spacing.xs, backgroundColor: "#374151", borderRadius: radii.full, paddingHorizontal: spacing.md, paddingVertical: 6 },
  text: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.white },
});
