import { db } from "../../../db";
import { sellers_product } from "../../../db/schema";

import { productModel } from "../model/addproduct.model";

export async function addProductService(userId: string, body: productModel) {
  const [postProduct] = await db
    .insert(sellers_product)
    .values({
      ...body,
      userId: userId,
    })
    .returning();

  if (!postProduct) {
    throw new Error("Failed to post product");
  }
  return postProduct;
}
