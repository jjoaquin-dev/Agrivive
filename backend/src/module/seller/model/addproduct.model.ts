import { t } from "elysia";

export const addProductModel = t.Object({
  productName: t.String({
    minLength: 1,
    error: "product name is required",
  }),
  imagUrl: t.File({
    type: "image/*",
    error: "dont supported that kind of file",
  }),
  productPrice: t.Numeric({
    minimum: 1,
    error: "price cannot be < 1",
  }),
  productQty: t.Integer({
    minimum: 1,
    error: "quantity cannot be < 1",
  }),
  productType: t.UnionEnum(
    [
      "Leafy Greens",
      "Root and Tuber Vegetables",
      "Bulb and Stem Vegetables",
      "Flower Vegetables",
      "Fruit Vegetables",
      "Seeds and Legumes",
    ],
    {
      minLength: 1,
      error: "product type is required",
    },
  ),
  scalingType: t.UnionEnum(["sack", "kilo", "pile"], {
    minLength: 1,
    error: "scaling type is required",
  }),
});

export type productModel = typeof addProductModel.static;
