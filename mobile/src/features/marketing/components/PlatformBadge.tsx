import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type Platform = "facebook" | "instagram";

export const platformName: Record<Platform, string> = { facebook: "Facebook", instagram: "Instagram" };

/** Small brand marks drawn with plain views, so no icon package is needed. */
export function PlatformBadge({ platform, size = 32 }: { platform: Platform; size?: number }) {
  if (platform === "facebook") {
    return (
      <View style={[styles.base, { width: size, height: size, borderRadius: size / 2, backgroundColor: "#1877F2" }]}>
        <Text style={[styles.f, { fontSize: size * 0.62, lineHeight: size * 0.8 }]}>f</Text>
      </View>
    );
  }
  const ring = size * 0.5;
  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: size * 0.3, backgroundColor: "#C13584" }]}>
      <View style={[styles.ring, { width: ring, height: ring, borderRadius: ring * 0.3 }]}>
        <View style={[styles.lens, { width: ring * 0.46, height: ring * 0.46, borderRadius: ring }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  f: { color: "#FFFFFF", fontWeight: "800", marginTop: 2 },
  ring: { borderWidth: 2, borderColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  lens: { borderWidth: 2, borderColor: "#FFFFFF" },
});
