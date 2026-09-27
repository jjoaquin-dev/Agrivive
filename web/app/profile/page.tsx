import { Suspense } from "react";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { BuyerProfile } from "@/src/features/profile/components/BuyerProfile";

export default function ProfilePage() {
  return (
    <>
      <BuyerSiteHeader />
      <Suspense fallback={<main className="min-h-[calc(100vh-72px)] bg-background py-10" />}>
        <BuyerProfile />
      </Suspense>
    </>
  );
}
