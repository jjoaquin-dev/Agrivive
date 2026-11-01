import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Package } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface Props {
  name: string;
  imageUrl: string | null;
  price: number;
  unit?: string | null;
}

/** One small row that names the product when there is nothing to preview, so a blocked screen stays short. */
export function BoostProductHeader({ name, imageUrl, price, unit }: Props) {
  const unitLabel = unit === "kilo" ? "kg" : unit;
  return (
    <View style={styles.row}>
      <View style={styles.photo}>
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : <Package size={20} color={colors.primary} />}
      </View>
      <View style={styles.copy}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.price}>₱{price.toFixed(2)}{unitLabel ? ` / ${unitLabel}` : ""} now</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  photo: { width: 52, height: 52, borderRadius: radii.input, overflow: "hidden", backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: "100%" },
  copy: { flex: 1, minWidth: 0 },
  name: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  price: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 },
});
