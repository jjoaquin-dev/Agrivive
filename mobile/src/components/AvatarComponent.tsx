import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { fonts } from "../theme";
import { getAvatarColor, getInitials } from "../features/conversations/utils/avatar";

interface AvatarComponentProps {
  name?: string | null;
  imageUrl?: string | null;
  size?: number;
}

/** Profile photo with a coloured initials circle when there is no photo or it fails to load. */
export const AvatarComponent: React.FC<AvatarComponentProps> = ({ name, imageUrl, size = 40 }) => {
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size, borderRadius: size / 2, backgroundColor: getAvatarColor(name || "Buyer") };

  return (
    <View style={[styles.box, box]} accessibilityIgnoresInvertColors>
      {imageUrl && !failed ? (
        <Image source={{ uri: imageUrl }} style={box} onError={() => setFailed(true)} />
      ) : (
        <Text style={[styles.initials, { fontSize: Math.round(size * 0.36) }]}>{getInitials(name)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  box: { alignItems: "center", justifyContent: "center", overflow: "hidden" },
  initials: { fontFamily: fonts.heading.bold, color: "#FFFFFF" },
});
