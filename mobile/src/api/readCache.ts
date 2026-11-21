import { Directory, File, Paths } from "expo-file-system";

/**
 * Keeps the last good answer of every read, so a weak signal shows saved data instead of an error.
 * One small file per path, in the app's private cache folder. Cleared on sign out.
 */
const folder = () => new Directory(Paths.cache, "api-reads");
const skip = /^\/(api\/auth|integrations)\b|otp|two-factor|password|recovery/i;

function fileFor(path: string) {
  let hash = 5381;
  for (let i = 0; i < path.length; i++) hash = ((hash * 33) ^ path.charCodeAt(i)) >>> 0;
  return new File(folder(), `${hash.toString(36)}.json`);
}

export function canCache(path: string) {
  return !skip.test(path);
}

export async function saveRead(path: string, data: unknown): Promise<void> {
  if (!canCache(path) || typeof data !== "object" || data === null) return;
  try {
    if (!folder().exists) folder().create({ intermediates: true });
    const file = fileFor(path);
    if (!file.exists) file.create();
    file.write(JSON.stringify({ path, savedAt: Date.now(), data }));
  } catch (error) {
    console.warn("Could not save a read for offline use", error);
  }
}

export async function loadRead<T>(path: string): Promise<{ data: T; savedAt: number } | null> {
  if (!canCache(path)) return null;
  try {
    const file = fileFor(path);
    if (!file.exists) return null;
    const saved = JSON.parse(await file.text());
    return saved.path === path ? { data: saved.data as T, savedAt: saved.savedAt } : null;
  } catch {
    return null;
  }
}

export function clearReads(): void {
  try {
    if (folder().exists) folder().delete();
  } catch (error) {
    console.warn("Could not clear saved reads", error);
  }
}
