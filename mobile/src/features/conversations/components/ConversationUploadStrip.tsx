import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { X } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface Props {
  uri: string;
  filename: string;
  uploading: boolean;
  onRemove: () => void;
}

/** The photo about to be sent. While it uploads there is a moving bar (we do not know the percent) and a button that really cancels it. */
export function ConversationUploadStrip({ uri, filename, uploading, onRemove }: Props) {
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!uploading) return;
    const loop = Animated.loop(Animated.timing(slide, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }));
    loop.start();
    return () => { loop.stop(); slide.setValue(0); };
  }, [uploading, slide]);

  return (
    <View style={styles.strip}>
      <Image source={{ uri }} style={styles.thumb} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{uploading ? "Uploading photo…" : "Photo ready to send"}</Text>
        {uploading ? (
          <View style={styles.track}>
            <Animated.View style={[styles.bar, { transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [-60, 200] }) }] }]} />
          </View>
        ) : null}
        <Text style={styles.file} numberOfLines={1}>{filename}</Text>
      </View>
      <Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel={uploading ? "Cancel upload" : "Remove photo"} style={styles.close}>
        <X size={18} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.surfaceMuted, borderRadius: radii.card, padding: spacing.sm, marginBottom: spacing.sm },
  thumb: { width: 48, height: 48, borderRadius: radii.sm + 2, backgroundColor: colors.border },
  body: { flex: 1 },
  title: { fontFamily: fonts.body.semiBold, fontSize: 14, color: colors.text },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: "hidden", marginVertical: 4 },
  bar: { width: 60, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  file: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted },
  close: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.border, alignItems: "center", justifyContent: "center" },
});
