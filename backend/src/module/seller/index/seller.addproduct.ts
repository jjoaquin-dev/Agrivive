import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { addProductModel } from "../model/addproduct.model";
import { addProductService } from "../services/addproduct.service";
export const sellerAddproduct = new Elysia().use(sessionAuth).post(
  "/addproduct",
  async ({ session, body, status }) => {
    try {
      const product = await addProductService(session.userId, body);
      return status(201, {
        message: "Product created",
        products: product,
      });
    } catch (error) {
      return status(500, { message: error });
    }
  },
  {
    role: ["seller", "buyer"],
    body: addProductModel,
  },
);
