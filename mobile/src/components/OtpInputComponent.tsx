import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TextInputKeyPressEvent,
  Text,
} from "react-native";
import { colors } from "../theme";

export interface OtpInputComponentProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const OtpInputComponent: React.FC<OtpInputComponentProps> = ({
  length = 6,
  value,
  onChange,
  error,
  disabled = false,
  autoFocus = true,
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
    <View style={styles.container}>
      <View style={styles.boxRow}>
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
                { width: boxWidth, height: boxHeight },
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#1E1E1E",
    padding: 0,
  },
  boxFilled: {
    borderColor: "#1E1E1E",
  },
  boxFocused: {
    borderColor: "#0F920F",
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
