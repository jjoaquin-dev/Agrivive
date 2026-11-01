import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { AuthTextLink } from "../auth/components/AuthTextLink";
import { colors, fonts, spacing } from "../../theme";

interface AppLoadingScreenProps {
  onRetry: () => void;
}

/** Same logo, same spot as the phone's own start screen so nothing jumps. The caption shows after 1.5s and Try Again after 10s. */
export const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({ onRetry }) => {
  const [showCaption, setShowCaption] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const captionTimer = setTimeout(() => setShowCaption(true), 1500);
    const retryTimer = setTimeout(() => setShowRetry(true), 10_000);
    return () => {
      clearTimeout(captionTimer);
      clearTimeout(retryTimer);
    };
  }, []);

  return (
    <View style={styles.screen}>
      <Image source={require("../../../assets/agrivive-splash.png")} style={styles.logo} resizeMode="contain" accessibilityLabel="Agrivive" />
      <ActivityIndicator size="small" color={colors.primary} style={styles.spinner} />
      <View style={styles.extra}>
        {showCaption ? <Text style={styles.caption}>Getting your stall ready…</Text> : null}
        {showRetry ? <AuthTextLink label="Taking too long? Try Again" onPress={onRetry} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  logo: { width: 200, height: 200 },
  spinner: { marginTop: spacing.base, transform: [{ scale: 1.2 }] },
  extra: { position: "absolute", left: 0, right: 0, top: "50%", marginTop: 150, alignItems: "center" },
  caption: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted },
});
