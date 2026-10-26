import React from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../theme";

export type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";

export interface ButtonComponentProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  destructive: {
    backgroundColor: colors.error,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
};

const pressedStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: colors.primaryPressed,
  },
  secondary: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
  },
  destructive: {
    backgroundColor: "#9E423E",
  },
  ghost: {
    backgroundColor: colors.primaryLight,
  },
};

const textVariantStyles: Record<ButtonVariant, TextStyle> = {
  primary: {
    color: colors.white,
  },
  secondary: {
    color: colors.primary,
  },
  destructive: {
    color: colors.white,
  },
  ghost: {
    color: colors.primary,
  },
};

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const isInteractive = !disabled && !loading;

  return (
    <Pressable
      onPress={isInteractive ? onPress : undefined}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && isInteractive ? pressedStyles[variant] : null,
        pressed && isInteractive ? styles.pressedScale : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "destructive" ? colors.white : colors.primary}
        />
      ) : (
        <>
          {icon ? <>{icon}</> : null}
          <Text
            style={[
              styles.textBase,
              textVariantStyles[variant],
              disabled ? styles.disabledText : null,
              icon ? { marginLeft: spacing.sm } : null,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: touchTargets.min,
    borderRadius: radii.button,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontFamily: fonts.body.semiBold,
    fontSize: 15,
    textAlign: "center",
  },
  disabledText: {
    color: colors.textMuted,
  },
  pressedScale: {
    transform: [{ scale: 0.98 }],
  },
});
