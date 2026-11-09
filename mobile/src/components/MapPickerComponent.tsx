import React, { useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import * as Location from "expo-location";
import { Expand, LocateFixed } from "lucide-react-native";
import { colors } from "../theme";
import { ButtonComponent } from "./ButtonComponent";
import { getStallAddressSuggestion } from "./map-picker/location-address";
import { MapPickerMap, type MapPickerMapHandle } from "./map-picker/MapPickerMap";
import { MapPickerFullScreen } from "./map-picker/MapPickerFullScreen";
import styles from "./map-picker/MapPicker.styles";
import type { Coordinates } from "./map-picker/types";

export type { Coordinates } from "./map-picker/types";

export const DAVAO_CITY_COORDINATES = {
  latitude: 7.0731,
  longitude: 125.6128,
};

export interface MapPickerComponentProps {
  initialCoordinates?: Coordinates | null;
  onCoordinatesChange?: (coords: Coordinates, suggestedAddress?: string) => void;
  height?: number;
  readOnly?: boolean;
  error?: string | null;
}

export const MapPickerComponent: React.FC<MapPickerComponentProps> = ({
  initialCoordinates,
  onCoordinatesChange,
  height = 200,
  readOnly = false,
  error,
}) => {
  const [selectedCoords, setSelectedCoords] = useState<Coordinates>(
    initialCoordinates || DAVAO_CITY_COORDINATES,
  );
  const [fullScreen, setFullScreen] = useState(false);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef<MapPickerMapHandle | null>(null);
  const fullMapRef = useRef<MapPickerMapHandle | null>(null);
  const addressRun = useRef(0);
  const onCoordinatesChangeRef = useRef(onCoordinatesChange);
  onCoordinatesChangeRef.current = onCoordinatesChange;

  // A tap or drag on the map places the pin anywhere in the world. The address guess comes a moment later.
  const handleMapCoordinatesChange = async (coordinates: Coordinates) => {
    setSelectedCoords(coordinates);
    onCoordinatesChangeRef.current?.(coordinates);
    const run = ++addressRun.current;
    const suggestedAddress = await getStallAddressSuggestion(coordinates);
    if (suggestedAddress && run === addressRun.current) onCoordinatesChangeRef.current?.(coordinates, suggestedAddress);
  };

  const closeFullScreen = () => {
    setFullScreen(false);
    mapRef.current?.panTo(selectedCoords.latitude, selectedCoords.longitude);
  };

  const handleUseCurrentLocation = async () => {
    if (readOnly) return;
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "You can still tap the map to place your pin.",
          [{ text: "OK" }],
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const newCoords = {
        latitude: parseFloat(location.coords.latitude.toFixed(6)),
        longitude: parseFloat(location.coords.longitude.toFixed(6)),
      };

      addressRun.current++;
      setSelectedCoords(newCoords);
      mapRef.current?.panTo(newCoords.latitude, newCoords.longitude);
      fullMapRef.current?.panTo(newCoords.latitude, newCoords.longitude);

      const suggestedAddress = await getStallAddressSuggestion(newCoords);
      onCoordinatesChangeRef.current?.(newCoords, suggestedAddress);
      if (!suggestedAddress) {
        Alert.alert(
          "Address Unavailable",
          "Your GPS pin is set. Please enter your stall address and a nearby landmark.",
          [{ text: "OK" }],
        );
      }
    } catch {
      Alert.alert(
        "Notice",
        "Could not detect GPS location. Please tap on the map to place your pin.",
      );
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.mapContainer, { height }, error ? styles.mapContainerError : null]}>
        <MapPickerMap
          ref={mapRef}
          coordinates={selectedCoords}
          readOnly={readOnly}
          onCoordinatesChange={handleMapCoordinatesChange}
        />
        {!readOnly ? (
          <Pressable onPress={() => setFullScreen(true)} accessibilityRole="button" accessibilityLabel="Open the map full screen" style={styles.expandButton}>
            <Expand size={18} color={colors.text} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.footerRow}>
        <View style={styles.coordsInfo}>
          <Text style={styles.coordsLabel}>Confirmed Pin:</Text>
          <Text style={styles.coordsValue}>
            {selectedCoords.latitude.toFixed(4)}, {selectedCoords.longitude.toFixed(4)}
          </Text>
        </View>
        {!readOnly ? (
          <ButtonComponent
            title={locating ? "Locating..." : "My GPS Location"}
            icon={<LocateFixed size={16} color={colors.primary} />}
            onPress={handleUseCurrentLocation}
            variant="secondary"
            loading={locating}
            style={styles.locButton}
            textStyle={styles.locButtonText}
          />
        ) : null}
      </View>
      {!readOnly ? (
        <MapPickerFullScreen
          visible={fullScreen}
          coordinates={selectedCoords}
          locating={locating}
          mapRef={fullMapRef}
          onCoordinatesChange={handleMapCoordinatesChange}
          onUseLocation={handleUseCurrentLocation}
          onClose={closeFullScreen}
        />
      ) : null}
    </View>
  );
};
