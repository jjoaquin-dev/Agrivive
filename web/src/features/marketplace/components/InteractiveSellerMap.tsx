"use client";

import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap, Marker } from "leaflet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OPEN_STREET_MAP_ATTRIBUTION, OPEN_STREET_MAP_TILE_URL } from "@/src/lib/maps";
import type { MarketplaceSellerMapResult } from "../types";
import { sellerMapPopupContent } from "./seller-map-popup";

type InteractiveSellerMapProps = {
  sellers: MarketplaceSellerMapResult[];
  unmappedSellerCount: number;
  latitude: number | null;
  longitude: number | null;
  radiusKm: number | null;
  selectedSellerId: string | null;
  loading: boolean;
  error: string;
  onSelectSeller: (sellerId: string) => void;
  onRetry: () => void;
  hideHeader?: boolean;
  expanded?: boolean;
  mapHeightClassName?: string;
};

export function InteractiveSellerMap({
  sellers, unmappedSellerCount, latitude, longitude, radiusKm,
  selectedSellerId, loading, error, onSelectSeller, onRetry, hideHeader = false, expanded = false,
  mapHeightClassName,
}: InteractiveSellerMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const clusterRef = useRef<LayerGroup | null>(null);
  const locationCircleRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markerRefs = useRef(new Map<string, Marker>());
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;

    async function createMap() {
      const leafletModule = await import("leaflet");
      await import("leaflet.markercluster");
      if (cancelled || !mapElementRef.current) return;
      const L = (leafletModule as unknown as { default?: typeof leafletModule }).default ?? leafletModule;
      const leafletWithClusters = L as typeof L & {
        markerClusterGroup: (options?: Record<string, unknown>) => LayerGroup;
      };
      map = L.map(mapElementRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([7.0731, 125.6128], 12);
      L.tileLayer(OPEN_STREET_MAP_TILE_URL, {
        attribution: OPEN_STREET_MAP_ATTRIBUTION,
        maxZoom: 19,
      }).addTo(map);
      clusterRef.current = leafletWithClusters.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 48,
        spiderfyOnMaxZoom: true,
      }).addTo(map);
      mapRef.current = map;
      leafletRef.current = L;
      map.invalidateSize();
      setMapReady(true);
    }

    void createMap();
    return () => {
      cancelled = true;
      markerRefs.current.clear();
      clusterRef.current?.clearLayers(); clusterRef.current = null;
      locationCircleRef.current?.clearLayers(); locationCircleRef.current = null;
      map?.remove(); mapRef.current = null; leafletRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Update map size on expand/collapse
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 200);
    }
  }, [expanded]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    const cluster = clusterRef.current;
    if (!map || !L || !cluster) return;

    cluster.clearLayers();
    markerRefs.current.clear();
    const markerIcon = L.icon({
      iconUrl: "/leaflet/marker-icon.png", iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      shadowUrl: "/leaflet/marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41],
      popupAnchor: [1, -34], shadowSize: [41, 41],
    });

    sellers.forEach((seller) => {
      const marker = L.marker([seller.latitude, seller.longitude], {
        icon: markerIcon,
        title: seller.shopName,
        alt: `Seller ${seller.shopName}`,
      });
      marker.bindPopup(sellerMapPopupContent(seller), { maxWidth: 320 });
      marker.on("click", () => onSelectSeller(seller.id));
      markerRefs.current.set(seller.id, marker);
      cluster.addLayer(marker);
    });

    if (sellers.length > 0) {
      const bounds = L.latLngBounds(sellers.map((seller) => [seller.latitude, seller.longitude] as [number, number]));
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 14 });
    } else if (latitude !== null && longitude !== null) {
      map.setView([latitude, longitude], 11);
    } else {
      map.setView([7.0731, 125.6128], 12);
    }
  }, [latitude, longitude, mapReady, onSelectSeller, sellers]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;
    locationCircleRef.current?.clearLayers();
    const group = L.layerGroup().addTo(map);
    locationCircleRef.current = group;
    if (latitude !== null && longitude !== null) {
      L.circle([latitude, longitude], {
        radius: (radiusKm ?? 10) * 1000, color: "#457d00", fillColor: "#457d00", fillOpacity: 0.08, weight: 1,
      }).addTo(group);
      L.circleMarker([latitude, longitude], {
        radius: 7, color: "#ffffff", weight: 2, fillColor: "#457d00", fillOpacity: 1,
      }).bindTooltip("Your location").addTo(group);
    }
  }, [latitude, longitude, mapReady, radiusKm]);

  useEffect(() => {
    const map = mapRef.current;
    const marker = selectedSellerId ? markerRefs.current.get(selectedSellerId) : null;
    if (!map || !marker) return;
    const point = marker.getLatLng();
    map.panTo(point, { animate: true, duration: 0.35 });
    marker.openPopup();
  }, [selectedSellerId]);

  const mapHeightClass = mapHeightClassName ?? (hideHeader
    ? expanded
      ? "h-[460px] w-full bg-agrivive-background"
      : "h-[312px] w-full bg-agrivive-background"
    : "h-[312px] w-full bg-agrivive-background sm:h-[360px] lg:h-[420px]");

  return (
    <div aria-label="Seller map" className="relative isolate z-0 flex h-full flex-col overflow-hidden w-full transition-all duration-300">
      {!hideHeader ? (
        <div className="flex items-start justify-between gap-4 border-b border-border/70 px-4 py-3 sm:px-5">
          <div>
            <h2 className="font-heading text-lg font-bold tracking-tight">Find a seller nearby</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Select a pin or a seller card to compare pickup spots.</p>
          </div>
          <span className="shrink-0 rounded-full border border-agrivive-sage/60 bg-agrivive-secondary px-3 py-1.5 text-xs font-semibold text-agrivive-primary">
            {sellers.length} {sellers.length === 1 ? "seller" : "sellers"}
          </span>
        </div>
      ) : null}
      <div className="relative flex-1 h-full min-h-0">
        <div
          ref={mapElementRef}
          className={mapHeightClass}
          aria-label="Interactive seller map"
        />
        {loading ? (
          <div className="pointer-events-none absolute inset-x-4 top-4 z-10 rounded-xl border border-border/60 bg-white/90 p-3 shadow-sm backdrop-blur-sm">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-2 h-3 w-56" />
          </div>
        ) : null}
        {error ? (
          <div className="absolute inset-x-4 bottom-4 z-10 sm:inset-x-5">
            <Alert variant="destructive" className="bg-white/95 shadow-lg">
              <AlertTitle>Map results could not refresh</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              <Button type="button" size="sm" variant="outline" onClick={onRetry}>Try again</Button>
            </Alert>
          </div>
        ) : null}
      </div>
      {unmappedSellerCount > 0 ? (
        <p className="border-t border-border/70 px-4 py-2.5 text-xs leading-5 text-muted-foreground sm:px-5">
          {unmappedSellerCount} matching {unmappedSellerCount === 1 ? "seller has" : "sellers have"} no map location yet.
        </p>
      ) : null}
    </div>
  );
}
