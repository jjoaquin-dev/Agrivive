import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "../src/styles/tokens.css";
import { CartProvider } from "@/src/features/cart/CartProvider";
import { CartDrawer } from "@/src/features/cart/components/CartDrawer";
import { WishlistProvider } from "@/src/features/wishlist/WishlistProvider";

export const metadata: Metadata = {
  title: "Agrivive",
  description: "Find and reserve fresh surplus produce.",
  icons: {
    icon: [
      { url: "/brand/agrivive-logo-icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/brand/agrivive-logo-icon.png",
    apple: "/brand/agrivive-logo-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="font-body">
      <body className="font-body antialiased">
        <WishlistProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
