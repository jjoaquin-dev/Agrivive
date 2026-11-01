import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors, fonts, radii, spacing } from "../../../theme";

interface ConversationQuickRepliesProps {
  onSelect: (reply: string) => void;
  shopName?: string | null;
}

export function ConversationQuickReplies({ onSelect, shopName }: ConversationQuickRepliesProps) {
  const stallReply = shopName ? `Pickup is at ${shopName}` : "Pickup is at our market stall";
  const chips = ["I'll check on it", "Yes, still available!", stallReply];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {chips.map((reply, i) => (
        <Pressable
          key={i}
          onPress={() => onSelect(reply)}
          accessibilityRole="button"
          accessibilityLabel={`Quick reply: ${reply}`}
          hitSlop={{ top: 4, bottom: 4, left: 2, right: 2 }}
          style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
        >
          <Text style={styles.chipText}>{reply}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
  },
  container: {
    paddingHorizontal: spacing.base,
    alignItems: "center",
    gap: spacing.sm,
  },
  chip: {
    height: 36,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  chipPressed: {
    backgroundColor: colors.primaryLight,
  },
  chipText: {
    fontFamily: fonts.body.medium,
    fontSize: 13,
    color: colors.primaryPressed,
  },
});
