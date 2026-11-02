import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db/index"; // your drizzle instance
import * as schema from "../../db/schema";
import { bearer, captcha, emailOTP, twoFactor } from "better-auth/plugins";
import { sendAuthCode } from "../../utils/email";
import { expo } from "@better-auth/expo";
import { isRecaptchaEnabled, recaptchaMinScore } from "../../utils/recaptcha";

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: process.env.BETTER_AUTH_URL || undefined,
  advanced: {
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"],
      trustedProxies: [
        "127.0.0.1",
        "::1",
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16",
      ],
    },
  },
  trustedOrigins: [
    "agrivive://",
    ...(process.env.NODE_ENV !== "production"
      ? [
          "exp://",
          "http://localhost:*",
          "http://127.0.0.1:*",
          "http://10.0.2.2:*",
          "http://192.168.*:*",
          "http://10.*:*",
        ]
      : []),
    ...(process.env.MOBILE_TRUSTED_ORIGINS ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    ...(process.env.WEB_TRUSTED_ORIGINS ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ],
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account consent",
          },
        }
      : {},
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
    ...(isRecaptchaEnabled()
      ? [
          captcha({
            provider: "google-recaptcha",
            secretKey: process.env.RECAPTCHA_SECRET_KEY!.trim(),
            minScore: recaptchaMinScore(),
            endpoints: [
              "/sign-in/email",
              "/sign-in/email-otp",
              "/email-otp/send-verification-otp",
            ],
          }),
        ]
      : []),
  ],
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
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
});
