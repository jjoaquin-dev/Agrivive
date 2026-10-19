"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { ProductDetail } from "@/src/features/marketplace/components/ProductDetail";

export default function MarketplaceProductPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      const currentPath = params?.id ? `/marketplace/${params.id}` : "/marketplace";
      router.replace(`/login?next=${encodeURIComponent(currentPath)}`);
    }
  }, [isPending, session, params, router]);

  if (isPending || !session?.user) {
    return (
      <>
        <BuyerSiteHeader />
        <main className="min-h-[calc(100vh-73px)] bg-agrivive-background py-12">
          <div className="mx-auto max-w-7xl px-4 animate-pulse">
            <div className="h-48 w-full rounded-2xl bg-card" />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <BuyerSiteHeader />
      <ProductDetail />
    </>
  );
}
