import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
  Pressable,
  TextStyle,
  ViewStyle,
} from "react-native";
import { AlertCircle, Eye, EyeOff } from "lucide-react-native";
import { colors, radii, spacing, touchTargets } from "../theme";

export interface InputComponentProps extends TextInputProps {
  label: string;
  error?: string | null;
  hint?: string | null;
  containerStyle?: ViewStyle;
  inputWrapperStyle?: ViewStyle;
  labelStyle?: TextStyle;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
}

export const InputComponent: React.FC<InputComponentProps> = ({
  label,
  error,
  hint,
  containerStyle,
  inputWrapperStyle,
  labelStyle,
  isPassword = false,
  leftIcon,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          inputWrapperStyle,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        {leftIcon ? <View style={styles.leftIconWrapper}>{leftIcon}</View> : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          {...textInputProps}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            style={styles.toggleButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.textMuted} />
            ) : (
              <Eye size={20} color={colors.textMuted} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <AlertCircle size={14} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  leftIconWrapper: {
    marginRight: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    minHeight: touchTargets.min,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.input,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.base,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  toggleButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.xs,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: colors.error,
  },
  hintText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
