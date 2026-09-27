import Link from "next/link";
import { LogIn, Store, UserPlus } from "lucide-react";
import { SiteHeader } from "@/src/components/SiteHeader";
import { PageContainer } from "@/src/components/PageContainer";

export default function HomePage() {
  return (
    <><SiteHeader /><main className="min-h-[calc(100vh-72px)] bg-agrivive-background py-8 text-agrivive-text">
      <PageContainer className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-center">
        <div className="w-full max-w-3xl">
        <section className="rounded-xl border bg-white p-8 shadow-sm sm:p-12">
          <p className="font-heading text-3xl font-bold text-agrivive-primary">Agrivive</p>
          <h1 className="mt-6 font-heading text-3xl font-bold sm:text-4xl">
            Fresh surplus, ready for pickup.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-agrivive-muted">
            Sign in or create a buyer account to reserve produce from local sellers.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/marketplace"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-agrivive-primary px-6 font-semibold text-white transition hover:bg-agrivive-primaryPressed"
            >
              <span>Browse marketplace</span><Store aria-hidden="true" size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-agrivive-primary px-6 font-semibold text-white transition hover:bg-agrivive-primaryPressed"
            >
              <span>Sign in</span><LogIn aria-hidden="true" size={18} />
            </Link>
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-agrivive-primary px-6 font-semibold text-agrivive-primary transition hover:bg-agrivive-background"
            >
              <span>Create an account</span><UserPlus aria-hidden="true" size={18} />
            </Link>
          </div>
        </section>
        </div>
      </PageContainer>
    </main></>
  );
}
