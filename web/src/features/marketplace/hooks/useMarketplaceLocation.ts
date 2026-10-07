"use client";

import { useState } from "react";

export function useMarketplaceLocation(searchKey: string, navigateWithParams: (params: URLSearchParams) => void) {
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "error">("idle");
  const [locationError, setLocationError] = useState("");

  function handleRemoveLocation() {
    const params = new URLSearchParams(searchKey);
    params.delete("latitude");
    params.delete("longitude");
    params.delete("radiusKm");
    setLocationError("");
    setLocationStatus("idle");
    navigateWithParams(params);
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError("Location is not available in this browser.");
      return;
    }
    setLocationStatus("loading");
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const params = new URLSearchParams(searchKey);
        params.set("latitude", coords.latitude.toFixed(6));
        params.set("longitude", coords.longitude.toFixed(6));
        params.set("radiusKm", params.get("radiusKm") || "10");
        params.delete("cursor");
        setLocationStatus("idle");
        navigateWithParams(params);
      },
      (reason) => {
        setLocationStatus("error");
        setLocationError(reason.code === 1
          ? "Allow location access to find nearby stalls."
          : reason.code === 2
            ? "Your location is not available right now. Try again or browse without it."
            : reason.code === 3
              ? "Finding your location took too long. Try again or browse without it."
              : "We could not find your location. Try again or browse without it.");
      },
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 8_000 },
    );
  }

  return { locationStatus, locationError, handleRemoveLocation, handleUseLocation };
}
