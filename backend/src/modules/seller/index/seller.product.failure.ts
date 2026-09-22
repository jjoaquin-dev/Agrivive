import { OrderError } from "../../../utils/order-types";

export function sellerProductFailure(error: unknown, status: (code: any, body: any) => any) {
  if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
  console.error(error);
  return status(500, { message: "Product operation failed" });
}
