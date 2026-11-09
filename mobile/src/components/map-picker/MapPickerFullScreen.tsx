import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocateFixed, X } from "lucide-react-native";
import { colors, fonts, radii, spacing, touchTargets } from "../../theme";
import { ButtonComponent } from "../ButtonComponent";
import { MapPickerMap, type MapPickerMapHandle } from "./MapPickerMap";
import type { Coordinates } from "./types";

interface MapPickerFullScreenProps {
  visible: boolean;
  coordinates: Coordinates;
  locating: boolean;
  mapRef: React.RefObject<MapPickerMapHandle | null>;
  onCoordinatesChange: (coordinates: Coordinates) => void;
  onUseLocation: () => void;
  onClose: () => void;
}

/** The pin map at full size, for placing the pin exactly (Fitts's Law, Paul Fitts: a bigger target is easier to hit). */
export function MapPickerFullScreen({ visible, coordinates, locating, mapRef, onCoordinatesChange, onUseLocation, onClose }: MapPickerFullScreenProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close map" style={styles.close}>
            <X size={22} color={colors.text} />
          </Pressable>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Place Your Pin</Text>
            <Text style={styles.hint}>Tap the map or drag the pin. Zoom in to be exact.</Text>
          </View>
        </View>
        <View style={styles.map}>
          <MapPickerMap ref={mapRef} coordinates={coordinates} readOnly={false} onCoordinatesChange={onCoordinatesChange} />
        </View>
        <View style={styles.bar}>
          <Text style={styles.coords}>{coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}</Text>
          <ButtonComponent
            title={locating ? "Locating..." : "Use My Location"}
            icon={<LocateFixed size={16} color={colors.primary} />}
            onPress={onUseLocation}
            variant="secondary"
            loading={locating}
          />
          <ButtonComponent title="Done" onPress={onClose} style={styles.done} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  close: { width: touchTargets.min, height: touchTargets.min, borderRadius: radii.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  titleBox: { flex: 1 },
  title: { fontFamily: fonts.heading.bold, fontSize: 18, color: colors.text },
  hint: { fontFamily: fonts.body.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  map: { flex: 1, backgroundColor: colors.surfaceMuted },
  bar: { padding: spacing.base, gap: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  coords: { fontFamily: fonts.body.medium, fontSize: 12, color: colors.textMuted, textAlign: "center" },
  done: { minHeight: touchTargets.min },
});
