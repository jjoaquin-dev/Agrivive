import Elysia from "elysia";

export const validationPlugin = new Elysia({
  name: "validation-plugin",
}).onError({ as: "global" }, ({ code, error, status }) => {
  if (code === "VALIDATION") {
    return error;
  }

  if (code === "NOT_FOUND") {
    return status(404, { message: "Resource not found" });
  }

  console.error("[API Error]", code, error);

  if (process.env.NODE_ENV === "production") {
    return status(500, { message: "An unexpected error occurred. Please try again later." });
  }
});
