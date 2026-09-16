import Elysia from "elysia";
import { sellerAddproduct } from "./index/seller.addproduct";
import { sellerAddProfile } from "./index/seller.addprofile";

export const sellerRoute = new Elysia({ prefix: "/seller" })
  .use(sellerAddProfile)
  .use(sellerAddproduct);

//upload seller product
