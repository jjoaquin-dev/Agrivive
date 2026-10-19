import React from "react";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { colors, radii, spacing, shadows } from "../theme";

export interface CardComponentProps extends ViewProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    padding: spacing.base,
    ...shadows.card,
  },
});
