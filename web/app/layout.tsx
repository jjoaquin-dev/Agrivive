import type { Metadata } from "next";
import localFont from "next/font/local";
import "../src/styles/tokens.css";
import "./globals.css";
import { CartProvider } from "@/src/features/cart/CartProvider";
import { CartDrawer } from "@/src/features/cart/components/CartDrawer";
import { WishlistProvider } from "@/src/features/wishlist/WishlistProvider";
import { PasswordSetupGuard } from "@/src/features/auth/components/PasswordSetupGuard";
import { LenisProvider } from "@/src/components/animations/LenisProvider";
import { SPLASH_KEY } from "@/src/lib/motion";

// All faces are vendored in src/fonts and loaded with next/font/local, so builds (including Docker) never
// depend on reaching Google Fonts. Latin subset only, SIL Open Font License.
const poppins = localFont({
  src: [
    { path: "../src/fonts/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "../src/fonts/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "../src/fonts/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "../src/fonts/poppins-700.woff2", weight: "700", style: "normal" },
    { path: "../src/fonts/poppins-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-heading",
  display: "swap",
  preload: false,
});

const lato = localFont({
  src: [
    { path: "../src/fonts/lato-300.woff2", weight: "300", style: "normal" },
    { path: "../src/fonts/lato-400.woff2", weight: "400", style: "normal" },
    { path: "../src/fonts/lato-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  preload: false,
});

const mdNichrome = localFont({
  src: [
    {
      path: "../public/fonts/MDNichromeTrial-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/MDNichromeTrial-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/MDNichromeTrial-Dark.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/MDNichromeTrial-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
  preload: false,
});

// The site's real faces. Self-hosted by next/font with size-matched fallbacks, so text does not shift when they load.
// Poppins, Lato, and MD Nichrome above stay as fallbacks only, so they are not preloaded.
const jakarta = localFont({
  src: "../src/fonts/plus-jakarta-sans-400-800.woff2",
  weight: "400 800",
  variable: "--font-jakarta",
  display: "swap",
  adjustFontFallback: "Arial",
});

const parkinsans = localFont({
  src: "../src/fonts/parkinsans-300-800.woff2",
  weight: "300 800",
  variable: "--font-parkinsans",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Agrivive",
  description: "Find and reserve fresh surplus produce.",
  icons: {
    icon: [
      { url: "/brand/agrivive-logo-bag.png", type: "image/png" },
    ],
    shortcut: "/brand/agrivive-logo-bag.png",
    apple: "/brand/agrivive-logo-bag.png",
  },
};

// Runs before first paint: hides the splash when it will be skipped, and holds its stage back until the
// GSAP timeline sets the start frame, so the logo never flashes in its final position.
const splashSkipScript = `try{var d=document.documentElement;if(sessionStorage.getItem("${SPLASH_KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("splash-skip");else if(location.pathname==="/")d.classList.add("splash-pending")}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${lato.variable} ${mdNichrome.variable} ${jakarta.variable} ${parkinsans.variable} font-body`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: splashSkipScript }} />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <LenisProvider>
          <WishlistProvider>
            <CartProvider>
              <PasswordSetupGuard />
              {children}
              <CartDrawer />
            </CartProvider>
          </WishlistProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
