const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
const CAPTCHA_HEADER = "x-captcha-response";

type Grecaptcha = {
  ready: (callback: () => void) => void;
  execute: (key: string, options: { action: string }) => Promise<string>;
};

let scriptPromise: Promise<Grecaptcha> | null = null;

function loadScript(key: string): Promise<Grecaptcha> {
  const existing = (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
  if (existing) return Promise.resolve(existing);
  scriptPromise ??= new Promise<Grecaptcha>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`;
    script.async = true;
    script.onload = () => resolve((window as unknown as { grecaptcha: Grecaptcha }).grecaptcha);
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Could not load the captcha check. Check your connection and try again."));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

// Returns headers for the API. Empty when no site key is set (local development).
export async function recaptchaHeaders(action: string): Promise<Record<string, string>> {
  if (!siteKey) return {};
  const grecaptcha = await loadScript(siteKey);
  await new Promise<void>((resolve) => grecaptcha.ready(resolve));
  const token = await grecaptcha.execute(siteKey, { action });
  return { [CAPTCHA_HEADER]: token };
}

// Starts loading Google's script early so the first click is fast.
export function preloadRecaptcha() {
  if (siteKey && typeof window !== "undefined") void loadScript(siteKey).catch(() => undefined);
}
