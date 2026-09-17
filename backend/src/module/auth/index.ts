import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db/index"; // your drizzle instance
import * as schema from "../../db/schema";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
  basePath: "/api/auth",
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  plugins: [bearer()],
  user: {
    additionalFields: {
      role: {
        defaultValue: ["buyer"],
        type: "string[]",
        required: true,
        returned: true,
      },
      isActive: {
        defaultValue: true,
        type: "boolean",
        required: true,
        returned: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
