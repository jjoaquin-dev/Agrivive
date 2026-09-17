import Elysia from "elysia";
export const validationPlugin = new Elysia({
  name: "validation-plugin",
}).onError({ as: "global" }, ({ code, error, status }) => {
  if (code === "VALIDATION") {
    return error;
  }
});
