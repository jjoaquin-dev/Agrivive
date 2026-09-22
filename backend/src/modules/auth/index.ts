import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db/index"; // your drizzle instance
import * as schema from "../../db/schema";
import { bearer, emailOTP, twoFactor } from "better-auth/plugins";
import { sendAuthCode } from "../../utils/email";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  basePath: "/api/auth",
  trustedOrigins: [
    "agrivive://",
    "exp://",
    "http://localhost:*",
    "http://127.0.0.1:*",
    "http://10.0.2.2:*",
    "http://192.168.*:*",
    "http://10.*:*",
    ...(process.env.MOBILE_TRUSTED_ORIGINS ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ],
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  plugins: [
    expo(),
    bearer(),
    emailOTP({
      sendVerificationOnSignUp: true,
      disableSignUp: true,
      overrideDefaultEmailVerification: true,
      storeOTP: "hashed",
      sendVerificationOTP: ({ email, otp, type }) =>
        sendAuthCode(email, otp, type),
    }),
    twoFactor({ issuer: "Agrivive" }),
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-in/email-otp" ||
        (ctx.path === "/email-otp/send-verification-otp" &&
          ctx.body?.type === "sign-in") ||
        (ctx.path === "/email-otp/check-verification-otp" &&
          ctx.body?.type === "sign-in")
      ) {
        throw new APIError("FORBIDDEN", {
          message: "Email OTP sign-in is disabled",
        });
      }
    }),
  },
  user: {
    additionalFields: {
      role: {
        defaultValue: ["buyer"],
        type: "string[]",
        required: true,
        returned: true,
        input: false,
      },
      isActive: {
        defaultValue: true,
        type: "boolean",
        required: true,
        returned: true,
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
