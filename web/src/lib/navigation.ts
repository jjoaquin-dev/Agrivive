export const DEFAULT_BUYER_DESTINATION = "/marketplace";

export function sanitizeNextPath(value: string | null | undefined) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return DEFAULT_BUYER_DESTINATION;
}

export function getNextPathFromLocation() {
  if (typeof window === "undefined") return DEFAULT_BUYER_DESTINATION;
  return sanitizeNextPath(new URLSearchParams(window.location.search).get("next"));
}

export function withNextPath(path: string, nextPath: string) {
  return path + (path.includes("?") ? "&" : "?") + "next=" + encodeURIComponent(sanitizeNextPath(nextPath));
}
