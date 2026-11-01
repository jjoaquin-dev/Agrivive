import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Check, ChevronDown, ChevronUp, Copy } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

/** The words Agrivive posted, shown read-only so the seller can copy and share them (FR-05). */
export function BoostPostText({ caption }: { caption: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await Clipboard.setStringAsync(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View>
      <Pressable
        onPress={() => setOpen((value) => !value)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={styles.toggle}
      >
        <Text style={styles.toggleText}>{open ? "Hide post text" : "See post text"}</Text>
        {open ? <ChevronUp size={14} color={colors.primary} /> : <ChevronDown size={14} color={colors.primary} />}
      </Pressable>
      {open ? (
        <View style={styles.box}>
          <Text style={styles.label}>Written by Agrivive</Text>
          <Text style={styles.caption} selectable>{caption}</Text>
          <Pressable onPress={() => void copy()} accessibilityRole="button" accessibilityLabel="Copy post text" style={styles.copyButton}>
            {copied ? <Check size={14} color={colors.success} /> : <Copy size={14} color={colors.primary} />}
            <Text style={[styles.copyText, copied && styles.copiedText]}>{copied ? "Copied" : "Copy Text"}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: { minHeight: 32, flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start" },
  toggleText: { fontFamily: fonts.body.semiBold, fontSize: 12, color: colors.primary },
  box: { backgroundColor: colors.surfaceMuted, borderRadius: radii.input, padding: spacing.md, marginTop: spacing.xs },
  label: { fontFamily: fonts.body.medium, fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs },
  caption: { fontFamily: fonts.body.regular, fontSize: 13, lineHeight: 18, color: colors.text },
  copyButton: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", marginTop: spacing.xs },
  copyText: { fontFamily: fonts.body.semiBold, fontSize: 13, color: colors.primary },
  copiedText: { color: colors.success },
});
