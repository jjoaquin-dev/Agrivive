import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-agrivive-background px-4 text-center text-agrivive-text">
      <section>
        <p className="font-heading text-5xl font-bold text-agrivive-primary">404</p>
        <h1 className="mt-4 font-heading text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-agrivive-muted">That page is not available.</p>
        <Link href="/" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-[10px] bg-agrivive-primary px-5 font-semibold text-white">
          <ArrowLeft aria-hidden="true" size={18} />Return home
        </Link>
      </section>
    </main>
  );
}
