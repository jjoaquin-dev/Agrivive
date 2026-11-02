import { LEGAL_EMAIL, LEGAL_ENTITY } from "./version";
import type { LegalDocument } from "./types";

export const termsOfUse: LegalDocument = {
  title: "Terms of Use",
  summary:
    "These are the rules for using Agrivive. By creating an account or using the website or app, you agree to them and to our Privacy Policy.",
  sections: [
    {
      id: "about",
      title: "About Agrivive",
      paragraphs: [
        `Agrivive is run by ${LEGAL_ENTITY}. It is a place where sellers list vegetables and buyers reserve them for pickup. Agrivive does not grow, sell, or deliver produce. The sale is between the buyer and the seller.`,
      ],
    },
    {
      id: "accounts",
      title: "Your account",
      items: [
        "Give true details and keep your password and sign-in codes private.",
        "You are responsible for what happens under your account.",
        "One person may hold a buyer role and a seller role on one email.",
        "Tell us right away if someone else used your account.",
      ],
    },
    {
      id: "buyers",
      title: "Buyers",
      items: [
        "A reservation holds produce for a limited time. Pick it up before it expires.",
        "Show your pickup pass to the seller when you collect your order.",
        "Cancel early if you cannot come, so the produce goes back on sale.",
      ],
    },
    {
      id: "sellers",
      title: "Sellers",
      items: [
        "Post true names, photos, prices, and amounts for what you really have.",
        "Keep produce safe, fresh, and as described.",
        "Reply to buyers and scan pickup passes on time.",
        "You are responsible for following food safety, tax, and business rules that apply to you.",
      ],
    },
    {
      id: "trust",
      title: "Trust score and limits",
      paragraphs: [
        "Missed replies, cancellations, and low ratings add trust points. Too many points can limit what an account can do, or pause it for a while. Limits are meant to protect buyers and fair sellers. You can use the recovery option on the sign-in page when your account is paused.",
      ],
    },
    {
      id: "not-allowed",
      title: "What is not allowed",
      items: [
        "Fake listings, fake reviews, or fake accounts.",
        "Harassing, threatening, or cheating other people.",
        "Selling things that are unsafe, illegal, or not vegetables or produce allowed on Agrivive.",
        "Trying to break, scrape, or overload the service.",
        "Using bots or tools to get around our security checks.",
      ],
    },
    {
      id: "content",
      title: "Your content",
      paragraphs: [
        "You keep ownership of the photos and text you post. You allow Agrivive to show them in the service, and, when a seller chooses, on Agrivive's Facebook and Instagram pages to promote the listing.",
      ],
    },
    {
      id: "changes-ending",
      title: "Changes and ending an account",
      paragraphs: [
        "We may update these terms. If we make an important change, we will ask you to accept it again. We may pause or close accounts that break these terms. You may stop using Agrivive and ask us to close your account at any time.",
      ],
    },
    {
      id: "liability",
      title: "Our responsibility",
      paragraphs: [
        "Agrivive is provided as is. We try to keep it running, but we cannot promise it will always be available or error free. We are not responsible for the quality of produce or for disputes between buyers and sellers, as far as the law allows.",
      ],
    },
    {
      id: "law-contact",
      title: "Law and contact",
      paragraphs: [
        `These terms follow the laws of the Republic of the Philippines. Questions can be sent to ${LEGAL_EMAIL}.`,
      ],
    },
  ],
};
