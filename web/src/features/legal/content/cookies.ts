import { LEGAL_EMAIL } from "./version";
import type { LegalDocument } from "./types";

export const cookieNotice: LegalDocument = {
  title: "Cookie Notice",
  summary:
    "Cookies are small files saved in your browser. This page lists the ones Agrivive uses and why.",
  sections: [
    {
      id: "needed",
      title: "Cookies we need",
      items: [
        "Sign-in cookie: keeps you signed in and keeps your account safe.",
        "Security cookies: help stop fake sign-ins and spam.",
        "Preference storage: remembers things like your cart and a pending sign-in step in your browser.",
      ],
      paragraphs: ["Agrivive does not work without these, so they cannot be turned off."],
    },
    {
      id: "google",
      title: "Google services",
      paragraphs: [
        "Google reCAPTCHA runs on sign-in, sign-up, and code request pages. It may set its own cookies and read how your browser behaves to tell people from bots. Google's Privacy Policy and Terms of Service apply. When you choose Sign in with Google, Google may also set cookies on its own pages.",
      ],
    },
    {
      id: "not-used",
      title: "What we do not use",
      paragraphs: ["We do not use advertising cookies and we do not sell data from cookies."],
    },
    {
      id: "control",
      title: "Your choices",
      paragraphs: [
        `You can delete cookies in your browser settings. Signing in will stop working while cookies are blocked. Questions can be sent to ${LEGAL_EMAIL}.`,
      ],
    },
  ],
};
