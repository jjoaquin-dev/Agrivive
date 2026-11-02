"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { preloadRecaptcha } from "@/src/lib/recaptcha";

// ---------------------------------------------------------------------------
// Video panel (looping brand video beside the auth form)
// ---------------------------------------------------------------------------
function AuthVideoPanel() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-[#F2F3F0]">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <video
          src="/brand/sign-in-video.mp4"
          aria-label="Fresh produce from local markets"
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AuthShell
// ---------------------------------------------------------------------------
type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  formMaxWidth?: string;
  /** @deprecated kept for backwards compat — all layouts now use two-column */
  centered?: boolean;
  /** Which side the video appears on. Defaults to "right". */
  imagePosition?: "left" | "right";
};

export function AuthShell({
  title,
  description,
  children,
  footer,
  formMaxWidth = "max-w-[440px]",
  imagePosition = "left",
}: AuthShellProps) {
  useEffect(() => {
    preloadRecaptcha();
  }, []);

  // Form column ---------------------------------------------------------------
  const formColumn = (
    <section className="flex min-h-screen w-full flex-col justify-center bg-white px-6 py-10 sm:px-12 lg:px-16">
      <div className={cn("mx-auto w-full", formMaxWidth)}>
        {/* Logo */}
        <Link
          href="/"
          className="group mb-8 flex w-fit items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]/30"
          aria-label="Agrivive home"
        >
          <Image
            src="/brand/agrivive-logo-full-new.png"
            alt="Agrivive"
            width={120}
            height={36}
            className="h-[36px] w-auto object-contain transition-transform duration-150 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Title & description */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-[#14231A] sm:text-[28px]">
            {title}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-[#5F7367]">
            {description}
          </p>
        </div>

        {/* Page-specific content */}
        {children}

        <Separator className="my-6 bg-agrivive-border/70" />
        <div className="text-center text-sm text-[#5F7367]">{footer}</div>
        <p className="mt-4 text-center text-xs leading-relaxed text-[#5F7367]">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="font-semibold text-[#457D00] hover:underline">Terms of Use</Link>
          {" "}and{" "}
          <Link href="/privacy" className="font-semibold text-[#457D00] hover:underline">Privacy Policy</Link>.
          {" "}This site is protected by reCAPTCHA and the Google{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a>
          {" "}and{" "}
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms of Service</a>
          {" "}apply.
        </p>
      </div>
    </section>
  );

  // Video column -------------------------------------------------------------
  const videoColumn = (
    <div className="hidden py-5 pl-24 pr-5 lg:sticky lg:top-10 lg:flex lg:h-[80vh] lg:flex-col lg:self-start">
      <AuthVideoPanel />
    </div>
  );

  return (
    <main className="relative grid min-h-screen w-full grid-cols-1 bg-white text-[#14231A] lg:grid-cols-2">

      {imagePosition === "left" ? (
        <>
          {videoColumn}
          {formColumn}
        </>
      ) : (
        <>
          {formColumn}
          {videoColumn}
        </>
      )}
    </main>
  );
}
