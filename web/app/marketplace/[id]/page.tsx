import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { ProductDetail } from "@/src/features/marketplace/components/ProductDetail";

export default function MarketplaceProductPage() {
  return (
    <>
      <BuyerSiteHeader />
      <ProductDetail />
    </>
  );
}

export const metadata = { title: "Produce Details | Agrivive" };
