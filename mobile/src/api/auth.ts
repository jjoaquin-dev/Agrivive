import { apiFetch } from "./client";

export type PasswordStatus = {
  hasPassword: boolean;
  passwordSetupRequired: boolean;
};

export function getPasswordStatus() {
  return apiFetch<PasswordStatus>("/auth/password-status");
}

export function setPassword(newPassword: string, confirmPassword: string) {
  return apiFetch<PasswordStatus>("/auth/password", {
    method: "POST",
    body: JSON.stringify({ newPassword, confirmPassword }),
  });
}
