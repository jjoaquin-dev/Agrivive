import { apiRequest } from "@/src/lib/api";

export type PasswordStatus = {
  hasPassword: boolean;
  passwordSetupRequired: boolean;
};

export function getPasswordStatus() {
  return apiRequest<PasswordStatus>("/auth/password-status");
}

export function setPassword(newPassword: string, confirmPassword: string) {
  return apiRequest<PasswordStatus>("/auth/password", {
    method: "POST",
    body: JSON.stringify({ newPassword, confirmPassword }),
  });
}
