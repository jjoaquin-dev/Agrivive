export const OPEN_STREET_MAP_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const OPEN_STREET_MAP_ATTRIBUTION = "&copy; <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noreferrer\">OpenStreetMap</a> contributors";

export function getDirectionsUrl(
  latitude: number | null,
  longitude: number | null,
  address?: string | null,
) {
  if (
    latitude !== null &&
    longitude !== null &&
    !Number.isNaN(Number(latitude)) &&
    !Number.isNaN(Number(longitude))
  ) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${latitude},${longitude}`)}`;
  }
  if (address && address.trim().length > 0) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address.trim())}`;
  }
  return null;
}

