import Elysia from "elysia";
import { OrderError } from "../../../utils/order-types";
import { sessionAuth } from "../../auth/services/auth.session";
import { sellerProductCreate } from "../model/seller.product.create";
import { createSellerProduct } from "../services/seller.product.create";

export const sellerProductCreateRoute = new Elysia().use(sessionAuth)
  .post("/products", async ({ session, body, status }) => {
    try {
      const product = await createSellerProduct(session.userId, body);
      if (!product) {
        return status(409, {
          message: "Product already listed with this selling unit",
        });
      }
      return status(201, {
        message: "Product created",
        products: product,
      });
    } catch (error) {
      if (error instanceof OrderError) {
        return status(error.statusCode, { message: error.message });
      }
      console.error(error);
      return status(500, { message: "Failed to create product" });
    }
  }, { role: ["seller"], body: sellerProductCreate })
  .post("/addproduct", async ({ session, body, status }) => {
    try {
      const product = await createSellerProduct(session.userId, body);
      if (!product) return status(409, { message: "Product already listed with this selling unit" });
      return status(201, { message: "Product created", products: product });
    } catch (error) {
      if (error instanceof OrderError) return status(error.statusCode, { message: error.message });
      console.error(error);
      return status(500, { message: "Failed to create product" });
    }
  }, { role: ["seller"], body: sellerProductCreate });
