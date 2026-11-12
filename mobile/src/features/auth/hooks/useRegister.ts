import { checkEmailPreflight } from "../emailCheck";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { authClient, apiFetch } from "../../../api/client";
import { validateNewPassword } from "../passwordRules";
import { recaptchaHeaders } from "../recaptcha";
import { LEGAL_VERSION } from "../../legal/legalLinks";


/** All the state and actions of the register screen, so the screen file only draws it. */
export function useRegister() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [accountNotice, setAccountNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});

  const handleEmailBlur = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) return;

    const check = await checkEmailPreflight(cleanEmail);
    if (!check) return;

    if (check.roleCount >= 2) {
      setErrors((prev) => ({
        ...prev,
        email: "This email already has both Buyer and Seller profiles (maximum 2 roles reached). Please sign in instead.",
      }));
      setAccountNotice(null);
    } else if (check.hasTargetRole) {
      setErrors((prev) => ({
        ...prev,
        email: "An account with this email is already registered as a Seller. Please sign in instead.",
      }));
      setAccountNotice(null);
    } else if (check.exists && check.canUseEmail) {
      setErrors((prev) => ({ ...prev, email: undefined }));
      setAccountNotice("Existing Buyer account found. Enter your password to add the Seller profile.");
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
      setAccountNotice(null);
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Please enter an email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!password) {
      newErrors.password = "Please enter a password.";
    } else {
      const passwordProblem = validateNewPassword(password);
      if (passwordProblem) newErrors.password = passwordProblem;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match. Please re-check.";
    }

    if (!acceptedTerms) newErrors.terms = "Please agree to the Terms of Use and Privacy Policy to continue.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const cleanEmail = email.trim().toLowerCase();

    try {
      const check = await checkEmailPreflight(cleanEmail);

      if (!check) {
        setErrors({
          general: "Could not connect to verify your email. Please try again.",
        });
        setLoading(false);
        return;
      }

      if (check.roleCount >= 2) {
        setErrors({
          email: "This email already has both Buyer and Seller profiles (maximum 2 roles reached). Please sign in instead.",
        });
        setLoading(false);
        return;
      }

      if (check.hasTargetRole) {
        setErrors({
          email: "An account with this email is already registered as a Seller. Please sign in instead.",
        });
        setLoading(false);
        return;
      }

      if (check.exists && check.canUseEmail) {
        try {
          await apiFetch<any>("/auth/register-role", {
            method: "POST",
            headers: await recaptchaHeaders("sign_up"),
            body: JSON.stringify({
              email: cleanEmail,
              password,
              targetRole: "seller",
              acceptedTerms: true,
              termsVersion: LEGAL_VERSION,
            }),
          });

          await authClient.signIn.email({
            email: cleanEmail,
            password,
          }, { headers: await recaptchaHeaders("sign_in") });

          router.replace("/(app)/profile/setup");
          return;
        } catch (expandErr: any) {
          const errMsg = expandErr?.message || "";
          if (errMsg.toLowerCase().includes("password") || expandErr?.statusCode === 401) {
            setErrors({
              password: "Incorrect password for your existing account. Enter your password to add the Seller profile.",
            });
          } else {
            setErrors({
              general: errMsg || "Could not link Seller profile to your account.",
            });
          }
          setLoading(false);
          return;
        }
      }

      try {
        await apiFetch<any>("/auth/register-role", {
          method: "POST",
          headers: await recaptchaHeaders("sign_up"),
          body: JSON.stringify({
            email: cleanEmail,
            password,
            name: "Seller",
            targetRole: "seller",
            acceptedTerms: true,
            termsVersion: LEGAL_VERSION,
          }),
        });

        router.replace({
          pathname: "/(auth)/verify-email",
          params: { email: cleanEmail, sent: "true" },
        });
      } catch (regErr: any) {
        setErrors({
          general: regErr?.message || "Could not register account. Please try again.",
        });
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.error("Registration error", err);
      setErrors({
        general: err?.message || "Could not register. Please check your network connection.",
      });
    } finally {
      setLoading(false);
    }
  };
  return { email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, loading, setLoading, acceptedTerms, setAcceptedTerms, accountNotice, setAccountNotice, errors, setErrors, checkEmailPreflight, handleEmailBlur, validate, handleRegister, router };
}
