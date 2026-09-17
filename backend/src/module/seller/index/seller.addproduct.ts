import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";
import { addProductModel } from "../model/addproduct.model";
import { addProductService } from "../services/addproduct.service";
export const sellerAddproduct = new Elysia().use(sessionAuth).post(
  "/addproduct",
  async ({ session, body, status }) => {
    try {
      return body.imagUrl.type;
    } catch (error) {
      return status(500, { message: error });
    }
  },
  {
    role: ["seller", "buyer"],
    body: addProductModel,
  },
);
