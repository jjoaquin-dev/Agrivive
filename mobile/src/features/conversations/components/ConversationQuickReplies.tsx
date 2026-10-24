import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { fonts, radii, spacing } from "../../../theme";

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
    height: 38,
    marginBottom: spacing.xs,
  },
  container: {
    paddingHorizontal: spacing.base,
    alignItems: "center",
    gap: spacing.sm,
  },
  chip: {
    height: 30,
    borderWidth: 1,
    borderColor: "#16A34A",
    borderRadius: radii.full,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  chipPressed: {
    backgroundColor: "#DCFCE7",
  },
  chipText: {
    fontFamily: fonts.body.medium,
    fontSize: 12,
    color: "#16A34A",
  },
});
