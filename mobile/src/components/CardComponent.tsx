import React from "react";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { colors, radii, spacing } from "../theme";

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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
});
