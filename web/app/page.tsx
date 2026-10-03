import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock3, LogIn, MapPin, Store } from "lucide-react";
import { SiteHeader } from "@/src/components/SiteHeader";
import { PageContainer } from "@/src/components/PageContainer";

export default function HomePage() {
  return (
    <><SiteHeader /><main className="min-h-[calc(100vh-68px)] bg-agrivive-background py-6 text-agrivive-text sm:py-10 lg:py-14">
      <PageContainer>
        <section className="grid overflow-hidden rounded-[28px] border border-agrivive-border bg-white shadow-[0_18px_60px_rgba(31,77,58,0.09)] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="flex items-center gap-2 text-sm font-semibold text-agrivive-primary">
              <span className="flex size-9 items-center justify-center rounded-xl bg-agrivive-background"><Store aria-hidden="true" size={18} /></span>
              <span>Local produce, ready nearby</span>
            </div>
            <h1 className="mt-6 max-w-xl font-heading text-4xl font-bold leading-[1.05] tracking-tight text-agrivive-text sm:text-5xl">
              Fresh surplus, ready for pickup.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-agrivive-muted sm:text-lg">
              Find good produce from local market stalls, reserve what you need, and pick it up when it suits you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/marketplace"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-agrivive-primary px-7 font-semibold text-white shadow-xs transition-[background-color,transform] hover:-translate-y-px hover:bg-agrivive-primaryPressed active:translate-y-px"
              >
                Browse marketplace<ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-agrivive-border bg-white px-6 font-semibold text-agrivive-primary transition-[background-color,border-color,transform] hover:-translate-y-px hover:border-agrivive-primary hover:bg-agrivive-background active:translate-y-px"
              >
                Sign in<LogIn aria-hidden="true" size={18} />
              </Link>
            </div>
            <p className="mt-3 text-xs text-agrivive-muted">
              New here?{" "}
              <Link href="/signup" className="font-semibold text-agrivive-primary underline-offset-4 hover:underline">
                Create a free account
              </Link>
            </p>
            <div className="mt-10 grid max-w-lg gap-3 border-t border-agrivive-border pt-5 sm:grid-cols-2">
              <div className="flex items-start gap-3"><span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-agrivive-background text-agrivive-primary"><MapPin size={16} aria-hidden="true" /></span><span className="text-sm leading-5 text-agrivive-muted">Browse sellers around Davao City markets.</span></div>
              <div className="flex items-start gap-3"><span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-agrivive-background text-agrivive-primary"><Clock3 size={16} aria-hidden="true" /></span><span className="text-sm leading-5 text-agrivive-muted">Hold your reservation for up to 24 hours.</span></div>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden bg-agrivive-primary lg:min-h-[620px]">
            <Image src="/brand/buyer-market-auth.png" alt="A local market seller preparing fresh vegetables" fill priority className="object-cover" sizes="(min-width: 1024px) 55vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-agrivive-primary/90 via-agrivive-primary/10 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 rounded-[20px] border border-white/20 bg-agrivive-primary/80 p-5 text-white shadow-xl backdrop-blur-md sm:inset-x-8 sm:bottom-8 sm:p-6">
              <p className="text-sm font-semibold text-emerald-100">A simpler way to shop local</p>
              <p className="mt-2 max-w-sm font-heading text-2xl font-bold leading-tight">Good food should have a shorter trip to your table.</p>
            </div>
          </div>
        </section>
      </PageContainer>
    </main></>
  );
}
