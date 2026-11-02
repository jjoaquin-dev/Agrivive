import type { Metadata } from "next";
import { LegalPage } from "@/src/features/legal/components/LegalPage";
import { privacyPolicy } from "@/src/features/legal/content/privacy";

export const metadata: Metadata = { title: "Privacy Policy | Agrivive" };

export default function Page() {
  return <LegalPage document={privacyPolicy} path="/privacy" />;
}
