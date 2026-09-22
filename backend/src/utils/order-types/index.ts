import { db } from "../../db";

export type OrderTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type OrderSide = "buyer" | "seller";
export type OrderStatus = "pending" | "completed" | "cancelled" | "expired";

export class OrderError extends Error {
  constructor(
    public readonly statusCode: 400 | 403 | 404 | 409 | 410,
    message: string,
  ) {
    super(message);
  }
}
