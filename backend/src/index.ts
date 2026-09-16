import { Elysia } from "elysia";
import { auth } from "./module/auth";
import openapi from "@elysia/openapi";
import { sellerRoute } from "./module/seller";

const app = new Elysia()
  .use(openapi())
  .mount(auth.handler)
  .use(sellerRoute)
  .get("/", () => "Hello Elysia")
  .get("/a", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
