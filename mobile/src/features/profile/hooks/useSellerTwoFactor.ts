import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { authClient } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";

export type TwoFactorStep = "idle" | "password" | "scan" | "verify" | "backup";

/** Everything the Sign-in Safety screen needs to turn the sign-in code on or off. */
export function useSellerTwoFactor() {
  const { setup, refreshSetup } = useAuth();
  const [step, setStep] = useState<TwoFactorStep>("idle");
  const [password, setPassword] = useState("");
  const [totpURI, setTotpURI] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [confirmCode, setConfirmCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [disabling, setDisabling] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [disableError, setDisableError] = useState<string | null>(null);

  const clearFlow = () => { setStep("idle"); setPassword(""); setTotpURI(null); setSecretKey(null); setConfirmCode(""); setPasswordError(null); setCodeError(null); };

  const startEnable = () => { clearFlow(); setGeneralError(null); setSuccessMessage(null); setStep("password"); };

  const requestEnable = async () => {
    if (!password) return setPasswordError("Please enter your current password to continue.");
    setLoading(true);
    setPasswordError(null);
    setGeneralError(null);
    try {
      const response = await authClient.twoFactor.enable({ password });
      if (response.error) return setPasswordError(response.error.message || "Incorrect password. Please verify and try again.");
      const data = response.data as any;
      if (data?.totpURI) {
        setTotpURI(data.totpURI);
        const match = data.totpURI.match(/secret=([A-Z0-9]+)/i);
        setSecretKey(match ? match[1] : null);
      }
      if (Array.isArray(data?.backupCodes)) setBackupCodes(data.backupCodes);
      setStep("scan");
      setPassword("");
    } catch (err: any) {
      setGeneralError(err?.message || "Failed to initiate authenticator setup.");
    } finally { setLoading(false); }
  };

  const verifyCode = async () => {
    const code = confirmCode.trim();
    if (!code) return setCodeError("Please enter the 6-digit code from your app.");
    if (code.length !== 6 || !/^\d+$/.test(code)) return setCodeError("Code must be exactly 6 digits.");
    setLoading(true);
    setCodeError(null);
    setGeneralError(null);
    try {
      const response = await authClient.twoFactor.verifyTotp({ code });
      if (response.error) return setCodeError(response.error.message || "Invalid or expired code. Please try again.");
      await refreshSetup();
      setConfirmCode("");
      setTotpURI(null);
      setSecretKey(null);
      if (backupCodes.length > 0) setStep("backup");
      else { setStep("idle"); setSuccessMessage("Sign-in code is now on."); }
    } catch (err: any) {
      setGeneralError(err?.message || "Failed to verify authenticator code.");
    } finally { setLoading(false); }
  };

  const copyCodes = async () => {
    await Clipboard.setStringAsync(backupCodes.join("\n"));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 3000);
  };

  const finishBackup = () => { setStep("idle"); setBackupCodes([]); setSuccessMessage("Sign-in code is now on."); };

  const disable = async () => {
    if (!disablePassword) return setDisableError("Please enter your password to turn it off.");
    setLoading(true);
    setDisableError(null);
    setGeneralError(null);
    try {
      const response = await authClient.twoFactor.disable({ password: disablePassword });
      if (response.error) return setDisableError(response.error.message || "Incorrect password. Could not turn it off.");
      await refreshSetup();
      setDisabling(false);
      setDisablePassword("");
      setSuccessMessage("Sign-in code is now off.");
    } catch (err: any) {
      setGeneralError(err?.message || "Failed to turn off the sign-in code.");
    } finally { setLoading(false); }
  };

  const back = () => {
    if (step === "verify") { setConfirmCode(""); setCodeError(null); setStep("scan"); }
    else if (step === "scan" || step === "password") clearFlow();
  };

  return {
    isOn: Boolean(setup?.twoFactorEnabled), step, loading, generalError, successMessage,
    password, passwordError, onPassword: (v: string) => { setPassword(v); setPasswordError(null); setGeneralError(null); },
    totpURI, secretKey, confirmCode, codeError, onCode: (v: string) => { setConfirmCode(v); setCodeError(null); setGeneralError(null); },
    backupCodes, copiedCodes, copyCodes, finishBackup,
    startEnable, requestEnable, verifyCode, toVerify: () => setStep("verify"), toScan: () => { setConfirmCode(""); setCodeError(null); setStep("scan"); }, back,
    disabling, disablePassword, disableError,
    startDisable: () => { setDisableError(null); setGeneralError(null); setSuccessMessage(null); setDisabling(true); },
    cancelDisable: () => { setDisabling(false); setDisablePassword(""); setDisableError(null); },
    onDisablePassword: (v: string) => { setDisablePassword(v); setDisableError(null); },
    disable,
  };
}
