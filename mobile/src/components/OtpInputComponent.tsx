import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TextInputKeyPressEvent,
  Text,
} from "react-native";
import { AlertCircle } from "lucide-react-native";
import { colors } from "../theme";

export interface OtpInputComponentProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Stretch the boxes across the full width, left-aligned (used by the sign-in and verify screens). */
  fill?: boolean;
}

export const OtpInputComponent: React.FC<OtpInputComponentProps> = ({
  length = 6,
  value,
  onChange,
  error,
  disabled = false,
  autoFocus = true,
  fill = false,
}) => {
  const inputRefs = useRef<(React.ElementRef<typeof TextInput> | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Split value into array of single characters
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  const handleTextChange = (text: string, index: number) => {
    if (disabled) return;

    // Handle paste of full or partial code
    if (text.length > 1) {
      const cleaned = text.replace(/[^0-9]/g, "").slice(0, length);
      onChange(cleaned);
      const nextFocus = Math.min(cleaned.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    // Only allow numeric digit
    const cleanedChar = text.replace(/[^0-9]/g, "");
    const newDigits = [...digits];
    newDigits[index] = cleanedChar;
    const combined = newDigits.join("");
    onChange(combined);

    // Auto-advance to next input if filled
    if (cleanedChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: TextInputKeyPressEvent,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move to previous input and clear it
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const boxWidth = length <= 4 ? 60 : 48;
  const boxHeight = length <= 4 ? 64 : 54;

  return (
    <View style={[styles.container, fill && styles.containerFill]}>
      <View style={[styles.boxRow, fill && styles.boxRowFill]}>
        {digits.map((digit, index) => {
          const isFilled = digit.length > 0;
          const isFocused = focusedIndex === index;
          return (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.box,
                fill ? styles.boxFill : { width: boxWidth, height: boxHeight },
                isFilled && styles.boxFilled,
                isFocused && styles.boxFocused,
                error ? styles.boxError : null,
              ]}
              value={digit}
              onChangeText={(text) => handleTextChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!disabled}
              autoFocus={autoFocus && index === 0}
              accessibilityLabel={`Digit ${index + 1} of ${length}`}
            />
          );
        })}
      </View>
      {error ? (
        <View style={[styles.errorRow, fill && styles.errorRowFill]}>
          {fill ? <AlertCircle size={14} color={colors.error} /> : null}
          <Text style={[styles.errorText, fill && styles.errorTextFill]}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 16,
  },
  boxRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  box: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E2DA",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#202622",
    padding: 0,
  },
  containerFill: { alignItems: "stretch", marginVertical: 0 },
  boxRowFill: { justifyContent: "flex-start", gap: 10 },
  boxFill: { flex: 1, height: 56 },
  errorRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  errorRowFill: { justifyContent: "flex-start", marginTop: 8 },
  errorTextFill: { marginTop: 0, flex: 1, textAlign: "left", fontWeight: "400", fontSize: 13 },
  boxFilled: {
    borderColor: "#202622",
  },
  boxFocused: {
    borderColor: "#457D00",
    borderWidth: 1.5,
  },
  boxError: {
    borderColor: colors.error,
    backgroundColor: "rgba(184, 84, 80, 0.04)",
  },
  errorText: {
    marginTop: 12,
    color: colors.error,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
