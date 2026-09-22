import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { LocateFixed, MapPin } from "lucide-react-native";
import { colors, radii, spacing } from "../theme";
import { ButtonComponent } from "./ButtonComponent";

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

export interface Coordinates {
  latitude: number;
  longitude: number;
}

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
  const webViewRef = useRef<WebView | null>(null);

  const panTo = (lat: number, lng: number) => {
    webViewRef.current?.injectJavaScript(`
      if (window.updatePosition) {
        window.updatePosition(${lat}, ${lng});
      }
      true;
    `);
  };

  const handleSelectMarket = (market: typeof DAVAO_MARKETS[0]) => {
    setActiveMarketId(market.id);
    setSelectedCoords(market.coords);
    panTo(market.coords.latitude, market.coords.longitude);
    onCoordinatesChange?.(market.coords, `Stall #__, ${market.fullName}, Davao City`);
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
      panTo(newCoords.latitude, newCoords.longitude);
      onCoordinatesChange?.(newCoords);
    } catch (err) {
      Alert.alert("Notice", "Could not detect GPS location. Please tap on the map or pick a market above.");
    } finally {
      setLocating(false);
    }
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (typeof data.latitude === "number" && typeof data.longitude === "number") {
        const newCoords = {
          latitude: parseFloat(data.latitude.toFixed(6)),
          longitude: parseFloat(data.longitude.toFixed(6)),
        };
        setSelectedCoords(newCoords);
        setActiveMarketId(null);
        onCoordinatesChange?.(newCoords);
      }
    } catch {
      // Ignore non-JSON messages
    }
  };

  const leafletHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      background-color: #E8E6DF;
    }
    .custom-marker {
      background: #1F4D3A;
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      width: 20px;
      height: 20px;
    }
    .leaflet-control-attribution {
      display: none !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: ${!readOnly},
      dragging: ${!readOnly},
      touchZoom: ${!readOnly},
      doubleClickZoom: ${!readOnly},
      scrollWheelZoom: false
    }).setView([${selectedCoords.latitude}, ${selectedCoords.longitude}], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    var markerIcon = L.divIcon({
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    var marker = L.marker([${selectedCoords.latitude}, ${selectedCoords.longitude}], {
      icon: markerIcon,
      draggable: ${!readOnly}
    }).addTo(map);

    ${!readOnly ? `
    map.on('click', function(e) {
      marker.setLatLng(e.latlng);
      window.ReactNativeWebView.postMessage(JSON.stringify({
        latitude: parseFloat(e.latlng.lat.toFixed(6)),
        longitude: parseFloat(e.latlng.lng.toFixed(6))
      }));
    });

    marker.on('dragend', function(e) {
      var pos = marker.getLatLng();
      window.ReactNativeWebView.postMessage(JSON.stringify({
        latitude: parseFloat(pos.lat.toFixed(6)),
        longitude: parseFloat(pos.lng.toFixed(6))
      }));
    });
    ` : ""}

    window.updatePosition = function(lat, lng) {
      map.setView([lat, lng], 16, { animate: true });
      marker.setLatLng([lat, lng]);
    };
  </script>
</body>
</html>
`;

  return (
    <View style={styles.container}>
      {!readOnly ? (
        <View style={styles.presetsSection}>
          <Text style={styles.presetTitle}>Quick Select Market:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsRow}>
            {DAVAO_MARKETS.map((m) => {
              const isSelected = activeMarketId === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => handleSelectMarket(m)}
                  style={[styles.presetChip, isSelected && styles.presetChipActive]}
                >
                  <MapPin
                    size={12}
                    color={isSelected ? colors.white : colors.primary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}>
                    {m.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      <View style={[styles.mapContainer, { height }, error ? styles.mapContainerError : null]}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: leafletHtml }}
          onMessage={handleMessage}
          scrollEnabled={false}
          nestedScrollEnabled={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={styles.webView}
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

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
  },
  presetsSection: {
    marginBottom: spacing.sm,
  },
  presetTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  presetsRow: {
    gap: spacing.xs,
  },
  presetChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text,
  },
  presetChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  mapContainer: {
    borderRadius: radii.card,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: "#E8E6DF",
  },
  mapContainerError: {
    borderColor: colors.error,
  },
  webView: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  coordsInfo: {
    flex: 1,
  },
  coordsLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "500",
  },
  coordsValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
  },
  locButton: {
    minHeight: 36,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  locButtonText: {
    fontSize: 12,
  },
});
