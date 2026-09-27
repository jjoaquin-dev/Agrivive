import React, { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import { LocateFixed, MapPin } from "lucide-react-native";
import { colors } from "../theme";
import { ButtonComponent } from "./ButtonComponent";
import { getStallAddressSuggestion } from "./map-picker/location-address";
import { MapPickerMap, type MapPickerMapHandle } from "./map-picker/MapPickerMap";
import styles from "./map-picker/MapPicker.styles";
import type { Coordinates } from "./map-picker/types";

export type { Coordinates } from "./map-picker/types";

export const DAVAO_CITY_COORDINATES = {
  latitude: 7.0731,
  longitude: 125.6128,
};

export const DAVAO_MARKETS = [
  { id: "bankerohan", name: "Bankerohan", fullName: "Bankerohan Public Market", coords: { latitude: 7.0652, longitude: 125.6078 } },
  { id: "agdao", name: "Agdao", fullName: "Agdao Public Market", coords: { latitude: 7.0864, longitude: 125.6264 } },
  { id: "toril", name: "Toril", fullName: "Toril Public Market", coords: { latitude: 7.0186, longitude: 125.4988 } },
  { id: "mintal", name: "Mintal", fullName: "Mintal Public Market", coords: { latitude: 7.0945, longitude: 125.5342 } },
  { id: "buhangin", name: "Buhangin", fullName: "Buhangin Public Market", coords: { latitude: 7.1082, longitude: 125.6185 } },
];

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
  const [activeMarketId, setActiveMarketId] = useState<string | null>("bankerohan");
  const [locating, setLocating] = useState(false);
  const mapRef = useRef<MapPickerMapHandle | null>(null);
  const onCoordinatesChangeRef = useRef(onCoordinatesChange);
  onCoordinatesChangeRef.current = onCoordinatesChange;

  const handleSelectMarket = (market: typeof DAVAO_MARKETS[number]) => {
    setActiveMarketId(market.id);
    setSelectedCoords(market.coords);
    mapRef.current?.panTo(market.coords.latitude, market.coords.longitude);
    onCoordinatesChangeRef.current?.(
      market.coords,
      ["Stall #__", market.fullName, "Davao City"].join(", "),
    );
  };

  const handleMapCoordinatesChange = (coordinates: Coordinates) => {
    setSelectedCoords(coordinates);
    setActiveMarketId(null);
    onCoordinatesChangeRef.current?.(coordinates);
  };

  const handleUseCurrentLocation = async () => {
    if (readOnly) return;
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission",
          "You can select a Davao City public market chip above or tap the map to place your pin.",
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

      setActiveMarketId(null);
      setSelectedCoords(newCoords);
      mapRef.current?.panTo(newCoords.latitude, newCoords.longitude);

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
        "Could not detect GPS location. Please tap on the map or pick a market above.",
      );
    } finally {
      setLocating(false);
    }
  };

  return (
    <View style={styles.container}>
      {!readOnly ? (
        <View style={styles.presetsSection}>
          <Text style={styles.presetTitle}>Quick Select Market:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetsRow}
          >
            {DAVAO_MARKETS.map((market) => {
              const isSelected = activeMarketId === market.id;
              return (
                <Pressable
                  key={market.id}
                  onPress={() => handleSelectMarket(market)}
                  style={[styles.presetChip, isSelected && styles.presetChipActive]}
                >
                  <MapPin
                    size={12}
                    color={isSelected ? colors.white : colors.primary}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}
                  >
                    {market.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      <View style={[styles.mapContainer, { height }, error ? styles.mapContainerError : null]}>
        <MapPickerMap
          ref={mapRef}
          coordinates={selectedCoords}
          readOnly={readOnly}
          onCoordinatesChange={handleMapCoordinatesChange}
        />
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
    </View>
  );
};
