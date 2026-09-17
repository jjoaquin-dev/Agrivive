import { Elysia } from "elysia";
import { auth } from "./module/auth";
import openapi from "@elysia/openapi";
import { sellerRoute } from "./module/seller";
import { validationPlugin } from "./plugins/validation.plugin";

const app = new Elysia()

  //plugins
  .use(validationPlugin)

  //openapi
  .use(openapi())

  //auth hadler
  .mount(auth.handler)

  //routes
  .use(sellerRoute)
  .get("/", () => "Hello Elysia")
  .get("/a", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
