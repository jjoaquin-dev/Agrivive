export function marketplaceUrl(productId: string) {
  const base = (process.env.WEB_APP_URL ?? process.env.WEB_TRUSTED_ORIGINS?.split(",")[0] ?? "")
    .trim().replace(/\/$/, "");
  const path = `/marketplace/${productId}`;
  try { return base ? new URL(path, base).toString() : path; }
  catch { return path; }
}
