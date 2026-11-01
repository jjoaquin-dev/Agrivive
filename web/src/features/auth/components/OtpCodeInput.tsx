"use client";

import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type OtpCodeInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: boolean;
  className?: string;
};

export function OtpCodeInput({
  id = "otp-input",
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
  error = false,
  className,
}: OtpCodeInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        e.preventDefault();
        const nextValue = value.slice(0, index - 1) + value.slice(index);
        onChange(nextValue);
        inputsRef.current[index - 1]?.focus();
      } else {
        const nextValue = value.slice(0, index) + value.slice(index + 1);
        onChange(nextValue);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleInputChange(index: number, rawChar: string) {
    const cleaned = rawChar.replace(/\D/g, "");
    if (!cleaned) return;
    const char = cleaned[cleaned.length - 1];
    const valChars = value.split("");
    while (valChars.length < length) valChars.push("");
    valChars[index] = char;
    const nextVal = valChars.join("").slice(0, length);
    onChange(nextVal);

    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasteData) return;
    onChange(pasteData);
    const targetIdx = Math.min(pasteData.length, length - 1);
    inputsRef.current[targetIdx]?.focus();
  }

  return (
    <div
      className={cn("flex items-center justify-center gap-2 sm:gap-2.5", className)}
      role="group"
      aria-label="Verification code input"
    >
      {digits.map((digit, index) => {
        const isFilled = Boolean(digit);
        return (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            id={index === 0 ? id : undefined}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            disabled={disabled}
            value={digit}
            autoComplete="one-time-code"
            aria-label={`Digit ${index + 1} of ${length}`}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              "h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-agrivive-border/80 bg-white text-center font-mono text-xl sm:text-2xl font-bold text-[#14231A] shadow-sm transition-all",
              "hover:border-[#457D00]/40 focus:border-[#457D00] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#457D00]/20",
              isFilled && "border-[#457D00]/40 bg-[#FBFDFB]",
              error && "border-destructive/80 text-destructive focus:border-destructive focus:ring-destructive/20",
              disabled && "cursor-not-allowed opacity-50",
            )}
          />
        );
      })}
    </div>
  );
}
