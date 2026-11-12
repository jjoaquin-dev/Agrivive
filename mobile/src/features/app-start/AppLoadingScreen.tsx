import React, { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { AuthTextLink } from "../auth/components/AuthTextLink";
import { colors, fonts } from "../../theme";

interface AppLoadingScreenProps {
  onRetry: () => void;
}

/**
 * Same logo, same spot as the phone's own start screen so nothing jumps. There is no spinner: the start screen stays still.
 * Android 12 and newer cut the start screen logo into a circle, so Android uses a padded square copy of the cart logo in both places.
 * The caption shows after 1.5s and Try Again after 10s.
 */
const androidLogo = Platform.OS === "android";
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
      <Image
        source={androidLogo ? require("../../../assets/brand/agrivive-splash-android.png") : require("../../../assets/brand/agrivive-logo-full.png")}
        style={androidLogo ? styles.iconLogo : styles.logo}
        resizeMode="contain"
        accessibilityLabel="Agrivive"
      />
      <View style={styles.extra}>
        {showCaption ? <Text style={styles.caption}>Getting your stall ready…</Text> : null}
        {showRetry ? <AuthTextLink label="Taking too long? Try Again" onPress={onRetry} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  logo: { width: 280, maxWidth: "80%", height: 81 },
  iconLogo: { width: 288, maxWidth: "80%", aspectRatio: 1, height: undefined },
  extra: { position: "absolute", left: 0, right: 0, top: "50%", marginTop: 90, alignItems: "center" },
  caption: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted },
});
