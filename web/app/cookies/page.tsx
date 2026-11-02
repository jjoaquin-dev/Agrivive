import type { Metadata } from "next";
import { LegalPage } from "@/src/features/legal/components/LegalPage";
import { cookieNotice } from "@/src/features/legal/content/cookies";

export const metadata: Metadata = { title: "Cookie Notice | Agrivive" };

export default function Page() {
  return <LegalPage document={cookieNotice} path="/cookies" />;
}
