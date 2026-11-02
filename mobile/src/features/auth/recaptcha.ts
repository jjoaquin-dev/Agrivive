// The hidden WebView in RecaptchaHost registers itself here, so any screen or API helper
// can ask for a token without being a component.
type Requester = (action: string) => Promise<string>;

let requester: Requester | null = null;

export const recaptchaSiteKey = process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";

export function registerRecaptchaRequester(next: Requester | null) {
  requester = next;
}

// Returns headers for the API. Empty when no site key is set (local development).
export async function recaptchaHeaders(action: string): Promise<Record<string, string>> {
  if (!recaptchaSiteKey) return {};
  if (!requester) throw new Error("The security check is not ready. Please try again.");
  return { "x-captcha-response": await requester(action) };
}
