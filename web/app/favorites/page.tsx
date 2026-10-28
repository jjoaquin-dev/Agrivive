import { Suspense } from "react";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { BuyerFavorites } from "@/src/features/wishlist/components/BuyerFavorites";

export default function FavoritesPage() {
  return (
    <>
      <BuyerSiteHeader />
      <Suspense fallback={<main className="min-h-[calc(100vh-73px)] bg-[#fdfdfd] py-10" />}>
        <BuyerFavorites />
      </Suspense>
    </>
  );
}
