import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Pencil, ShieldCheck } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import { safeBack } from "../../../utils/safeBack";

interface ProfileHeaderBarProps {
  onEdit: () => void;
  onSecurity: () => void;
}

export const ProfileHeaderBar: React.FC<ProfileHeaderBarProps> = ({ onEdit, onSecurity }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => safeBack(router)}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={styles.iconCircle}
      >
        <ChevronLeft size={20} color="#1E293B" />
      </Pressable>

      <Text style={styles.title}>Seller Profile</Text>

      <View style={styles.rightActions}>
        <Pressable
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          style={styles.iconCircle}
        >
          <Pencil size={17} color="#475569" />
        </Pressable>

        <Pressable
          onPress={onSecurity}
          accessibilityRole="button"
          accessibilityLabel="Security settings"
          style={styles.iconCircle}
        >
          <ShieldCheck size={18} color="#475569" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: "#FFFFFF",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 17,
    color: "#0F172A",
  },
  rightActions: {
    flexDirection: "row",
    gap: spacing.xs,
  },
});
