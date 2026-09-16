import Elysia from "elysia";
import { sessionAuth } from "../../auth/services/auth.session";

export const sellerAddproduct = new Elysia()
  .use(sessionAuth)
  .post("/addproduct", async ({ session }) => session, {
    role: ["seller", "buyer"],
  });
