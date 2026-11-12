import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { SellerStorefront } from "@/src/features/marketplace/components/SellerStorefront";

export default function SellerStorefrontPage() {
  return <><BuyerSiteHeader /><SellerStorefront /></>;
}

export const metadata = { title: "Seller Page | Agrivive" };
