import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { StyleSheet } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import type { Coordinates } from "./types";

export interface MapPickerMapHandle {
  panTo: (latitude: number, longitude: number) => void;
}

interface MapPickerMapProps {
  coordinates: Coordinates;
  readOnly: boolean;
  onCoordinatesChange: (coordinates: Coordinates) => void;
}

export const MapPickerMap = forwardRef<MapPickerMapHandle, MapPickerMapProps>(
  function MapPickerMap({ coordinates, readOnly, onCoordinatesChange }, ref) {
    const webViewRef = useRef<WebView | null>(null);

    useImperativeHandle(ref, () => ({
      panTo(latitude, longitude) {
        webViewRef.current?.injectJavaScript(
          "if (window.updatePosition) { window.updatePosition(" +
            latitude +
            ", " +
            longitude +
            "); } true;",
        );
      },
    }), []);

    const handleMessage = (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (typeof data.latitude !== "number" || typeof data.longitude !== "number") return;

        onCoordinatesChange({
          latitude: parseFloat(data.latitude.toFixed(6)),
          longitude: parseFloat(data.longitude.toFixed(6)),
        });
      } catch {
        // Ignore non-JSON messages.
      }
    };

    const interactions = readOnly
      ? ""
      : [
          "    map.on('click', function(e) {",
          "      marker.setLatLng(e.latlng);",
          "      window.ReactNativeWebView.postMessage(JSON.stringify({",
          "        latitude: parseFloat(e.latlng.lat.toFixed(6)),",
          "        longitude: parseFloat(e.latlng.lng.toFixed(6))",
          "      }));",
          "    });",
          "",
          "    marker.on('dragend', function(e) {",
          "      var pos = marker.getLatLng();",
          "      window.ReactNativeWebView.postMessage(JSON.stringify({",
          "        latitude: parseFloat(pos.lat.toFixed(6)),",
          "        longitude: parseFloat(pos.lng.toFixed(6))",
          "      }));",
          "    });",
        ].join("\n");

    const leafletHtml = [
      "<!DOCTYPE html>",
      "<html>",
      "<head>",
      "  <meta charset=\"utf-8\" />",
      "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\" />",
      "  <link rel=\"stylesheet\" href=\"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css\" />",
      "  <script src=\"https://unpkg.com/leaflet@1.9.4/dist/leaflet.js\"></script>",
      "  <style>",
      "    html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background-color: #E8E6DF; }",
      "    .custom-marker { background: #1F4D3A; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.4); width: 20px; height: 20px; }",
      "    .leaflet-control-attribution { display: none !important; }",
      "  </style>",
      "</head>",
      "<body>",
      "  <div id=\"map\"></div>",
      "  <script>",
      "    var map = L.map('map', {",
      "      zoomControl: __INTERACTIVE__,",
      "      dragging: __INTERACTIVE__,",
      "      touchZoom: __INTERACTIVE__,",
      "      doubleClickZoom: __INTERACTIVE__,",
      "      scrollWheelZoom: false",
      "    }).setView([__LATITUDE__, __LONGITUDE__], 15);",
      "",
      "    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);",
      "    var markerIcon = L.divIcon({ className: 'custom-marker', iconSize: [20, 20], iconAnchor: [10, 10] });",
      "    var marker = L.marker([__LATITUDE__, __LONGITUDE__], { icon: markerIcon, draggable: __INTERACTIVE__ }).addTo(map);",
      "    __INTERACTIONS__",
      "",
      "    window.updatePosition = function(lat, lng) {",
      "      map.setView([lat, lng], 16, { animate: true });",
      "      marker.setLatLng([lat, lng]);",
      "    };",
      "  </script>",
      "</body>",
      "</html>",
    ].join("\n")
      .replaceAll("__INTERACTIVE__", String(!readOnly))
      .replaceAll("__LATITUDE__", String(coordinates.latitude))
      .replaceAll("__LONGITUDE__", String(coordinates.longitude))
      .replace("__INTERACTIONS__", interactions);

    return (
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: leafletHtml }}
        onMessage={handleMessage}
        scrollEnabled={false}
        nestedScrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        style={styles.webView}
      />
    );
  },
);

MapPickerMap.displayName = "MapPickerMap";

const styles = StyleSheet.create({
  webView: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
});
