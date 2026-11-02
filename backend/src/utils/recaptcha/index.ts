import { OrderError } from "../order-types";

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
let warnedMissingSecret = false;

export function isRecaptchaEnabled() {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY?.trim());
}

export function recaptchaMinScore() {
  const score = Number(process.env.RECAPTCHA_MIN_SCORE);
  return Number.isFinite(score) && score > 0 && score <= 1 ? score : 0.5;
}

// Throws OrderError(400) when the token is missing, rejected, or scores too low.
// Skips the check when RECAPTCHA_SECRET_KEY is not set, so local dev keeps working.
export async function verifyRecaptcha(headers: Headers) {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    if (!warnedMissingSecret) {
      warnedMissingSecret = true;
      console.warn("RECAPTCHA_SECRET_KEY is not set. Captcha checks are skipped.");
    }
    return;
  }

  const token = headers.get("x-captcha-response")?.trim();
  if (!token) throw new OrderError(400, "Captcha check is missing. Please try again.");

  const form = new URLSearchParams({ secret, response: token });
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) form.set("remoteip", ip);

  let result: { success?: boolean; score?: number };
  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(10_000),
    });
    result = await response.json();
  } catch (error) {
    console.error("reCAPTCHA verification failed", error);
    throw new OrderError(400, "Captcha check could not finish. Please try again.");
  }

  if (!result.success || (result.score ?? 0) < recaptchaMinScore()) {
    throw new OrderError(400, "Captcha check failed. Please try again.");
  }
}
