export const SPLASH_KEY = "agrivive-splash-seen";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function shouldSkipSplash() {
  if (prefersReducedMotion()) return true;
  try {
    return sessionStorage.getItem(SPLASH_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSplashSeen() {
  try {
    sessionStorage.setItem(SPLASH_KEY, "1");
  } catch {
    // Storage can be blocked; the splash then plays again next visit.
  }
}

const SPLASH_ASSET_WAIT_MS = 1500;

/**
 * Resolves once web fonts and the hero image are decoded, so the splash never measures or
 * animates a fallback layout. Capped so a slow asset cannot hold the splash indefinitely.
 */
export function waitForSplashAssets(heroImage: HTMLImageElement | null) {
  const assets = Promise.all([
    document.fonts.ready,
    heroImage ? heroImage.decode().catch(() => undefined) : undefined,
  ]);
  const cap = new Promise<void>((resolve) => setTimeout(resolve, SPLASH_ASSET_WAIT_MS));
  return Promise.race([assets, cap]);
}
