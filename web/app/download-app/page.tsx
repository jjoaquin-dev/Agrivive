import type { Metadata } from "next";
import { InstallGuide } from "@/src/features/download/components/InstallGuide";

export const metadata: Metadata = { title: "Install the Seller App | Agrivive" };

export default function Page() {
  return <InstallGuide />;
}
