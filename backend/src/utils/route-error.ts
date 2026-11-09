import { OrderError } from "./order-types";

/** Turns a thrown OrderError into its HTTP status and message; anything else is logged and answered with a plain 500. */
export function routeError(status: (code: any, body: any) => any, error: unknown, fallback: string) {
  if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
  console.error(error);
  return status(500, { message: fallback });
}
