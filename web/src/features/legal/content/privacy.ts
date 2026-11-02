import { LEGAL_EMAIL, LEGAL_ENTITY } from "./version";
import type { LegalDocument } from "./types";

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  summary:
    "This page explains what Agrivive collects, why we collect it, who can see it, and how you can control it. We follow the Data Privacy Act of 2012 (Republic Act 10173).",
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      paragraphs: [
        `Agrivive is run by ${LEGAL_ENTITY}. Agrivive connects buyers with local vegetable sellers. Buyers reserve produce online and pick it up from the seller.`,
        `Questions about your data can be sent to ${LEGAL_EMAIL}.`,
      ],
    },
    {
      id: "what-we-collect",
      title: "What we collect",
      items: [
        "Account details: your name, email address, password (stored only in scrambled form), and your role as buyer or seller.",
        "Sign-in with Google: your name, email, and profile picture from your Google account.",
        "Profile and shop details: profile picture, shop name, shop description, and pickup location for sellers.",
        "Orders and chats: reservations, pickup status, ratings, reviews, and messages between buyers and sellers.",
        "Listings: product names, photos, prices, amounts, and harvest details that sellers post.",
        "Location: the shop location a seller chooses on the map. If you allow it, your phone location is used to show nearby sellers.",
        "Device details: your phone push token, so we can send order and message alerts, plus basic technical details such as browser type and IP address for security.",
        "Trust records: missed replies, cancellations, and low ratings that count toward the trust score.",
      ],
    },
    {
      id: "why-we-use-it",
      title: "Why we use it",
      items: [
        "To create your account, keep it secure, and send sign-in codes.",
        "To run reservations, pickups, chats, and ratings.",
        "To rank listings fairly and flag accounts that need attention (trust and visibility scores).",
        "To send alerts about orders, messages, and shops you follow.",
        "To prevent spam and fake accounts, including with Google reCAPTCHA.",
        "To help sellers share their listings on Facebook and Instagram, only when the seller chooses to.",
      ],
    },
    {
      id: "who-sees-it",
      title: "Who can see your data",
      items: [
        "Buyers see a seller's shop name, listings, ratings, and pickup area.",
        "Sellers see the buyer name and order details for orders placed with them.",
        "Agrivive administrators see account and order records to keep the service safe.",
        "Partners who help us run the service: Amazon Web Services (hosting and file storage), Google (sign-in and reCAPTCHA), Resend or Mailtrap (email), Firebase (push alerts), and Meta (Facebook and Instagram posts a seller starts).",
        "We do not sell your personal data.",
      ],
    },
    {
      id: "keeping-it",
      title: "How long we keep it",
      paragraphs: [
        "We keep your data while your account is open. Order and trust records may be kept longer when needed to settle disputes, stop abuse, or follow the law. When we no longer need data, we delete it or remove what identifies you.",
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      paragraphs: ["Under the Data Privacy Act you may:"],
      items: [
        "Ask what personal data we hold about you.",
        "Ask us to correct data that is wrong.",
        "Ask us to delete your data or close your account.",
        "Object to or limit how we use your data.",
        "Ask for a copy of your data.",
        "Complain to the National Privacy Commission (privacy.gov.ph).",
      ],
    },
    {
      id: "security",
      title: "How we protect it",
      paragraphs: [
        "Connections use HTTPS. Passwords and sign-in codes are stored in scrambled form. Access to records is limited by role. No system is perfectly safe, so tell us right away if you think your account was misused.",
      ],
    },
    {
      id: "children",
      title: "Children",
      paragraphs: [
        "Agrivive is for people 18 and older, or younger users with a parent or guardian's permission. We do not knowingly collect data from children without that permission.",
      ],
    },
    {
      id: "recaptcha",
      title: "Google reCAPTCHA",
      paragraphs: [
        "We use Google reCAPTCHA on sign-in, sign-up, and code requests to stop bots. It checks how you use the page and sends that information to Google. Google's Privacy Policy and Terms of Service apply.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: [
        "When we change this policy, we update the date at the top of this page. For big changes we will tell you in the app or by email.",
      ],
    },
  ],
};
