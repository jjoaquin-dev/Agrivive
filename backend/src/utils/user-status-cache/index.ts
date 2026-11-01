export interface CachedUserStatus {
  isActive: boolean;
  role: string[];
  email: string;
  blockReason?: string;
  cachedAt: number;
}

/** Account status read by sessionAuth, kept for a short time so every request doesn't hit the user table. */
export const userStatusCache = new Map<string, CachedUserStatus>();
export const STATUS_CACHE_TTL_MS = 30_000;

/** Drop a user's cached status so the next request reads the fresh value (e.g. right after an account is restored). */
export function forgetUserStatus(userId: string) {
  userStatusCache.delete(userId);
}
