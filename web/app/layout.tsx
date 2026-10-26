import type { Metadata } from "next";
import { Lato, Poppins } from "next/font/google";
import "../src/styles/tokens.css";
import { CartProvider } from "@/src/features/cart/CartProvider";
import { CartDrawer } from "@/src/features/cart/components/CartDrawer";
import { WishlistProvider } from "@/src/features/wishlist/WishlistProvider";
import { PasswordSetupGuard } from "@/src/features/auth/components/PasswordSetupGuard";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agrivive",
  description: "Find and reserve fresh surplus produce.",
  icons: {
    icon: [
      { url: "/brand/agrivive-logo-crate.png", type: "image/png" },
    ],
    shortcut: "/brand/agrivive-logo-crate.png",
    apple: "/brand/agrivive-logo-crate.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${lato.variable} font-body`} suppressHydrationWarning>
      <body className="font-body antialiased" suppressHydrationWarning>
        <WishlistProvider>
          <CartProvider>
            <PasswordSetupGuard />
            {children}
            <CartDrawer />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
