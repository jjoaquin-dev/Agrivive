import * as Location from "expo-location";
import type { Coordinates } from "./types";

export async function getStallAddressSuggestion(
  coordinates: Coordinates,
): Promise<string | undefined> {
  try {
    const [place] = await Location.reverseGeocodeAsync(coordinates);
    if (!place) return undefined;

    const streetAddress = [place.streetNumber, place.street]
      .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
      .map((part) => part.trim())
      .join(" ");
    const addressParts = [
      place.name,
      streetAddress || place.formattedAddress,
      place.district,
      place.subregion,
      place.city,
      place.region,
    ].filter(
      (part): part is string =>
        typeof part === "string" && part.trim().length > 0,
    ).map((part) => part.trim());

    const seen = new Set<string>();
    const uniqueParts = addressParts.filter((part) => {
      const key = part.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return uniqueParts.join(", ") || undefined;
  } catch {
    return undefined;
  }
}
