"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { MarketplaceBrowser } from "@/src/features/marketplace/components/MarketplaceBrowser";

export default function MarketplacePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login?next=/marketplace");
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <>
        <BuyerSiteHeader />
        <main className="min-h-[calc(100vh-73px)] bg-[#fdfdfd] py-12">
          <div className="mx-auto max-w-7xl px-4 animate-pulse">
            <div className="h-32 w-full rounded-2xl bg-card" />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <BuyerSiteHeader />
      <MarketplaceBrowser />
    </>
  );
}
