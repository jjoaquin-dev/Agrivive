import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomeFinalCta() {
  return (
    <section className="overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-agrivive-terracotta">
          A warmer market trip starts here
        </span>
        <h2 className="mx-auto mt-4 max-w-3xl font-heading text-5xl font-extrabold leading-[0.95] tracking-[-0.06em] text-agrivive-primary sm:text-6xl">
          Bring a little more good home.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-agrivive-muted">
          Find what is ready nearby and make your next pickup feel simple.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/marketplace"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-agrivive-primary px-7 font-semibold text-white transition-[background-color,transform] hover:-translate-y-px hover:bg-agrivive-primaryPressed active:translate-y-px"
          >
            Browse marketplace <ArrowRight aria-hidden="true" size={18} />
          </Link>
          <Link
            href="/signup"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-agrivive-border bg-white px-7 font-semibold text-agrivive-primary transition-[background-color,border-color,transform] hover:-translate-y-px hover:border-agrivive-primary hover:bg-agrivive-background active:translate-y-px"
          >
            Join Agrivive
          </Link>
        </div>
        <Image
          src="/brand/agrivive-welcome-basket.png"
          alt="A colorful basket of local vegetables"
          width={1600}
          height={720}
          className="mx-auto mt-10 h-auto w-full max-w-4xl"
        />
      </div>
    </section>
  );
}
