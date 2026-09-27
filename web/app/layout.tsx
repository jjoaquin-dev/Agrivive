import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "../src/styles/tokens.css";
import { CartProvider } from "@/src/features/cart/CartProvider";
import { CartDrawer } from "@/src/features/cart/components/CartDrawer";
import { cn } from "@/lib/utils";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Agrivive",
  description: "Find and reserve fresh surplus produce.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(manrope.variable, inter.variable, "font-body")}>
      <body className="font-body antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
