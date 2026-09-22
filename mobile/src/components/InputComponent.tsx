import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
  Pressable,
  ViewStyle,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { colors, radii, spacing, touchTargets } from "../theme";

export interface InputComponentProps extends TextInputProps {
  label: string;
  error?: string | null;
  hint?: string | null;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
}

export const InputComponent: React.FC<InputComponentProps> = ({
  label,
  error,
  hint,
  containerStyle,
  isPassword = false,
  leftIcon,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        {leftIcon ? <View style={styles.leftIconWrapper}>{leftIcon}</View> : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
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
        <Text style={styles.errorText}>{error}</Text>
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
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
  hintText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
