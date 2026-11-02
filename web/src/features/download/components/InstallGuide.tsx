import { ArrowDownToLine, Smartphone } from "lucide-react";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { PageContainer } from "@/src/components/PageContainer";
import { HomeFooter } from "@/src/features/home/components/HomeFooter";
import { LEGAL_EMAIL } from "@/src/features/legal/content/version";
import { SELLER_APK_URL } from "@/src/lib/appDownload";
import { helpItems, installSteps } from "../content";

export function InstallGuide() {
  return (
    <>
      <BuyerSiteHeader />
      <main className="bg-agrivive-background py-12 text-[#14231A] sm:py-16">
        <PageContainer>
          <div className="mx-auto max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#457D00]">
              <Smartphone className="size-4" aria-hidden="true" />Android phones
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Install the Agrivive Seller App</h1>
            <p className="mt-3 text-base leading-relaxed text-[#2F3F35]">
              The seller app is a file you install yourself. It takes about two minutes. iPhone is not supported yet.
            </p>

            <a
              href={SELLER_APK_URL}
              download="agrivive-seller.apk"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#457D00] px-6 text-base font-semibold text-white transition-colors hover:bg-[#386400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00] focus-visible:ring-offset-2"
            >
              <ArrowDownToLine className="size-4" aria-hidden="true" />Download Seller App
            </a>

            <section className="mt-10" aria-labelledby="install-steps">
              <h2 id="install-steps" className="font-heading text-xl font-bold">Install in 5 steps</h2>
              <ol className="mt-4 space-y-3">
                {installSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4 rounded-2xl border border-agrivive-border bg-white p-5">
                    <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#457D00] font-heading text-base font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-heading text-base font-bold">{step.title}</h3>
                      <p className="mt-1 text-base leading-relaxed text-[#2F3F35]">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-10" aria-labelledby="install-help">
              <h2 id="install-help" className="font-heading text-xl font-bold">Something went wrong?</h2>
              <dl className="mt-4 divide-y divide-agrivive-border rounded-2xl border border-agrivive-border bg-white">
                {helpItems.map((item) => (
                  <div key={item.problem} className="p-5">
                    <dt className="font-heading text-base font-bold">{item.problem}</dt>
                    <dd className="mt-1 text-base leading-relaxed text-[#2F3F35]">{item.fix}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-base text-[#2F3F35]">
                Still stuck? Email us at <span className="font-semibold text-[#14231A]">{LEGAL_EMAIL}</span> and tell us your phone model.
              </p>
            </section>
          </div>
        </PageContainer>
      </main>
      <HomeFooter />
    </>
  );
}
