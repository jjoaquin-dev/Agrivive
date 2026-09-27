import { createAuthClient } from "better-auth/react";
import { emailOTPClient, twoFactorClient } from "better-auth/client/plugins";

const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const authClient = createAuthClient({
  baseURL: apiUrl,
  basePath: "/api/auth",
  plugins: [emailOTPClient(), twoFactorClient()],
  fetchOptions: {
    credentials: "include",
  },
});
