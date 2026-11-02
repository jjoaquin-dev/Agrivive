import type { Metadata } from "next";
import { LegalPage } from "@/src/features/legal/components/LegalPage";
import { termsOfUse } from "@/src/features/legal/content/terms";

export const metadata: Metadata = { title: "Terms of Use | Agrivive" };

export default function Page() {
  return <LegalPage document={termsOfUse} path="/terms" />;
}
