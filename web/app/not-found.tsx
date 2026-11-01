import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";

export default function NotFound() {
  return (
    <>
      <BuyerSiteHeader />
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 py-16 text-center text-[#14231A]">
        <p className="font-heading text-7xl font-bold text-[#457D00]">404</p>
        <h1 className="mt-4 font-heading text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-lg text-[#5F7367]">That page is not available.</p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#457D00] px-5 text-base font-semibold text-white transition-colors hover:bg-[#457D00]/90"
        >
          <ArrowLeft aria-hidden="true" size={18} />Return home
        </Link>
      </main>
    </>
  );
}
