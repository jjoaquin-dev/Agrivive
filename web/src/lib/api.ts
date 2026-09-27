const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isAbortError(error: unknown) {
  return typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...options,
      cache: "no-store",
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    if (options.signal?.aborted || isAbortError(error)) throw error;
    throw new ApiError(0, "We could not connect to Agrivive. Check your connection and try again.");
  }

  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
          ? payload.error
        : response.status === 401
          ? "Please sign in to continue."
          : response.status === 403
            ? "You do not have permission to do that."
          : response.status === 404
            ? "We could not find that page or item."
            : response.status === 409
              ? "This changed while you were working. Please review and try again."
              : response.status >= 500
                ? "Agrivive is having trouble right now. Please try again."
            : "Something went wrong. Please try again.";
    throw new ApiError(response.status, message);
  }

  return payload as T;
}

export function apiPath(path: string) {
  return `${apiUrl}${path}`;
}
