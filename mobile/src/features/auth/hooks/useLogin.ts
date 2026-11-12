import React, { useState } from "react";
import { useRouter } from "expo-router";
import { authClient } from "../../../api/client";
import { recaptchaHeaders } from "../recaptcha";
import { useAuth } from "../../../context/AuthContext";

/** All the state and actions of the login screen, so the screen file only draws it. */
export function useLogin() {
  const router = useRouter();
  const { refreshSetup, completeOnboarding } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Please enter your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }
    if (!password) {
      newErrors.password = "Please enter your password.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      }, { headers: await recaptchaHeaders("sign_in") });

      if (response.error) {
        const errorCode = (response.error as { code?: string }).code;
        const msg = response.error.message?.toLowerCase() || "";
        if (errorCode === "ACCOUNT_RESTRICTED") {
          router.replace({ pathname: "/(auth)/account-recovery", params: { email: email.trim().toLowerCase() } });
          return;
        }
        const isEmailNotVerified =
          errorCode === "EMAIL_NOT_VERIFIED" || msg.includes("email not verified");

        if (isEmailNotVerified) {
          const cleanEmail = email.trim().toLowerCase();
          let sent = false;
          try {
            const sendRes = await authClient.emailOtp.sendVerificationOtp({
              email: cleanEmail,
              type: "email-verification",
            }, { headers: await recaptchaHeaders("send_code") });
            if (!sendRes?.error) sent = true;
          } catch (otpError) {
            console.warn("Could not send verification OTP after login", otpError);
          }

          router.replace({
            pathname: "/(auth)/verify-email",
            params: { email: cleanEmail, sent: sent ? "true" : "false" },
          });
          return;
        }

        if (msg.includes("password") || msg.includes("credential") || msg.includes("user")) {
          setErrors({ password: "The email or password you entered is incorrect." });
        } else if (msg.includes("email")) {
          setErrors({ email: response.error.message });
        } else {
          setErrors({
            general: response.error.message || "Could not sign in. Please check your credentials.",
          });
        }
        return;
      }

      if ((response.data as any)?.twoFactorRedirect) {
        router.push({
          pathname: "/(auth)/two-factor",
          params: { email: email.trim().toLowerCase() },
        });
        return;
      }

      await completeOnboarding();
      const setup = await refreshSetup();

      if (setup) {
        if (!setup.emailVerified || setup.nextStep === "verify-email") {
          const cleanEmail = email.trim().toLowerCase();
          let sent = false;
          try {
            const sendRes = await authClient.emailOtp.sendVerificationOtp({
              email: cleanEmail,
              type: "email-verification",
            }, { headers: await recaptchaHeaders("send_code") });
            if (!sendRes?.error) sent = true;
          } catch (otpErr) {
            console.warn("Could not automatically send verification OTP on login", otpErr);
          }

          router.replace({
            pathname: "/(auth)/verify-email",
            params: { email: cleanEmail, sent: sent ? "true" : "false" },
          });
          return;
        }

        if (!setup.profileComplete || setup.nextStep === "profile") {
          router.replace("/(app)/profile/setup");
          return;
        }

        if (setup.passwordSetupRequired) {
          router.replace("/(auth)/password-setup");
          return;
        }
      }

      router.replace("/(app)/(tabs)/home");
    } catch (err: any) {
      console.error("Login error", err);
      setErrors({
        general: err?.message || "Could not sign in. Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => router.push("/(auth)/forgot-password");
  return { email, setEmail, password, setPassword, loading, setLoading, errors, setErrors, validate, handleLogin, handleForgotPassword, router };
}
