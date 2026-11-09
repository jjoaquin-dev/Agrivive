import type { HoursDay } from "../stall/components/StallHoursEditor";

export type SellerSetupErrors = {
  personName?: string;
  shopName?: string;
  phoneNumber?: string;
  detailAddress?: string;
  coordinates?: string;
  hours?: string;
  general?: string;
};

/** Checks the first-time setup form and returns a plain message for each field that needs fixing. */
export function validateSellerSetup(input: {
  personName: string;
  phoneNumber: string;
  shopName: string;
  detailAddress: string;
  coordinates: { latitude: number; longitude: number } | null;
  hours: HoursDay[];
}): SellerSetupErrors {
  const errors: SellerSetupErrors = {};
  if (!input.personName.trim()) errors.personName = "Please enter your full personal name.";
  if (!input.phoneNumber.trim()) errors.phoneNumber = "Please enter your contact phone number.";
  else if (input.phoneNumber.trim().length < 7) errors.phoneNumber = "Please enter a valid phone number (at least 7 digits).";
  if (!input.shopName.trim()) errors.shopName = "Please enter your stall or shop name.";
  if (!input.detailAddress.trim()) errors.detailAddress = "Please enter your stall address or market section.";
  const pin = input.coordinates;
  if (!pin || typeof pin.latitude !== "number" || typeof pin.longitude !== "number") errors.coordinates = "Please set your stall location on the map.";
  if (input.hours.every((day) => day.isClosed)) errors.hours = "Open at least one day so buyers can reserve pickup times.";
  return errors;
}
