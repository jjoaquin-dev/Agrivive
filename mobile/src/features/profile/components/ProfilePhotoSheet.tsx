import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Camera, ChevronRight, ImageIcon } from "lucide-react-native";
import { colors, fonts, radii, spacing } from "../../../theme";
import { profileColors } from "../profileTokens";

interface Props {
  visible: boolean;
  onTake: () => void;
  onChoose: () => void;
  onClose: () => void;
}

function Option({ icon, title, hint, onPress }: { icon: React.ReactNode; title: string; hint: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
      <View style={styles.optionIcon}>{icon}</View>
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionHint}>{hint}</Text>
      </View>
      <ChevronRight size={18} color={colors.textMuted} />
    </Pressable>
  );
}

export function ProfilePhotoSheet({ visible, onTake, onChoose, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdrop}>
        <Pressable style={styles.dismiss} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.handle} />
          <Text style={styles.title}>Profile Photo</Text>
          <Text style={styles.sub}>Update your seller profile picture</Text>
          <View style={styles.list}>
            <Option icon={<Camera size={20} color={colors.primary} />} title="Take Photo" hint="Use device camera" onPress={onTake} />
            <View style={styles.divider} />
            <Option icon={<ImageIcon size={20} color={colors.primary} />} title="Choose from Library" hint="Select from your photos" onPress={onChoose} />
          </View>
          <Pressable onPress={onClose} accessibilityRole="button" style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(17,24,39,0.45)", justifyContent: "flex-end" },
  dismiss: { flex: 1 },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: radii.sheet + 8, borderTopRightRadius: radii.sheet + 8, padding: spacing.lg, paddingBottom: spacing.xl },
  handle: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: profileColors.border, marginBottom: spacing.md },
  title: { fontFamily: fonts.heading.bold, fontSize: 22, color: colors.text },
  sub: { fontFamily: fonts.body.regular, fontSize: 14, color: colors.textMuted, marginTop: 2, marginBottom: spacing.md },
  list: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: profileColors.border },
  divider: { height: 1, backgroundColor: profileColors.border },
  option: { flexDirection: "row", alignItems: "center", minHeight: 64, paddingVertical: spacing.sm },
  pressed: { backgroundColor: "#F3F1EA" },
  optionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  optionText: { flex: 1 },
  optionTitle: { fontFamily: fonts.heading.bold, fontSize: 16, color: colors.text },
  optionHint: { fontFamily: fonts.body.regular, fontSize: 13, color: colors.textMuted },
  cancel: { minHeight: 52, borderRadius: radii.button, backgroundColor: "#F3F1EA", alignItems: "center", justifyContent: "center", marginTop: spacing.md },
  cancelText: { fontFamily: fonts.body.semiBold, fontSize: 16, color: colors.textMuted },
});
