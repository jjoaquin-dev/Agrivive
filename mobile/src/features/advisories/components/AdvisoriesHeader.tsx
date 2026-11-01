import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, Modal } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, RotateCw, Info, X } from "lucide-react-native";
import { colors, fonts, spacing } from "../../../theme";
import { safeBack } from "../../../utils/safeBack";

interface AdvisoriesHeaderProps {
  generatedAt?: string;
  refreshing: boolean;
  onRefresh: () => void;
}

function formatUpdated(timestamp?: string) {
  if (!timestamp) return "Updated recently";
  const date = new Date(timestamp);
  const datePart = date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  const timePart = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return `Updated ${datePart} · ${timePart}`;
}

export const AdvisoriesHeader: React.FC<AdvisoriesHeaderProps> = ({
  generatedAt,
  refreshing,
  onRefresh,
}) => {
  const router = useRouter();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          onPress={() => safeBack(router)}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={styles.iconCircle}
        >
          <ChevronLeft size={20} color="#1E293B" />
        </Pressable>

        <View style={styles.titleWrap}>
          <Text style={styles.title}>Weather & Holiday Advisory</Text>
          <Text style={styles.subtitle}>Local weather and upcoming holiday guidance</Text>
        </View>

        <View style={styles.rightActions}>
          <Pressable
            onPress={onRefresh}
            disabled={refreshing}
            accessibilityRole="button"
            accessibilityLabel="Refresh advisories"
            style={[styles.iconCircle, refreshing && styles.iconDisabled]}
          >
            <RotateCw size={17} color="#475569" />
          </Pressable>

          <Pressable
            onPress={() => setShowInfo(true)}
            accessibilityRole="button"
            accessibilityLabel="Advisory information"
            style={styles.iconCircle}
          >
            <Info size={17} color="#475569" />
          </Pressable>
        </View>
      </View>

      <View style={styles.timestampRow}>
        <Text style={styles.timestampText}>{formatUpdated(generatedAt)}</Text>
      </View>

      {/* Info Modal */}
      <Modal visible={showInfo} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About Advisories</Text>
              <Pressable onPress={() => setShowInfo(false)} style={styles.closeBtn}>
                <X size={18} color="#64748B" />
              </Pressable>
            </View>
            <Text style={styles.modalText}>
              Weather data is provided by Open-Meteo based on your registered market stall coordinates. Philippine holidays are retrieved from official calendar schedules.
            </Text>
            <Text style={styles.modalText}>
              Use these advisories to plan stall operations, protective produce covers, and buyer pickup schedules.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  iconDisabled: {
    opacity: 0.5,
  },
  titleWrap: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  title: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  timestampRow: {
    alignItems: "center",
    marginTop: spacing.xs,
  },
  timestampText: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: "#64748B",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.base,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: spacing.base,
    width: "100%",
    maxWidth: 340,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: 16,
    color: "#0F172A",
  },
  closeBtn: {
    padding: 4,
  },
  modalText: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    lineHeight: 18,
    color: "#334155",
    marginBottom: spacing.xs,
  },
});
