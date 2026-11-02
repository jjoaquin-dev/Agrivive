import Link from "next/link";
import { BuyerSiteHeader } from "@/src/components/BuyerSiteHeader";
import { PageContainer } from "@/src/components/PageContainer";
import { HomeFooter } from "@/src/features/home/components/HomeFooter";
import type { LegalDocument } from "../content/types";
import { LEGAL_UPDATED_LABEL } from "../content/version";

const otherPages = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookies", label: "Cookie Notice" },
];

export function LegalPage({ document, path }: { document: LegalDocument; path: string }) {
  return (
    <>
      <BuyerSiteHeader />
      <main className="bg-agrivive-background py-12 text-[#14231A] sm:py-16">
        <PageContainer>
          <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <nav aria-label="On this page">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5F7367]">On this page</p>
                <ul className="mt-3 space-y-2 border-l border-agrivive-border">
                  {document.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-[#5F7367] transition-colors hover:border-[#457D00] hover:text-[#14231A]"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <article className="max-w-3xl rounded-2xl border border-agrivive-border bg-white p-6 sm:p-10">
              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{document.title}</h1>
              <p className="mt-2 text-sm text-[#5F7367]">Last updated {LEGAL_UPDATED_LABEL}</p>
              <p className="mt-6 text-base leading-relaxed text-[#14231A]">{document.summary}</p>

              {document.sections.map((section) => (
                <section key={section.id} id={section.id} className="mt-10 scroll-mt-24">
                  <h2 className="font-heading text-xl font-bold">{section.title}</h2>
                  {section.paragraphs?.map((text) => (
                    <p key={text} className="mt-3 text-base leading-relaxed text-[#2F3F35]">{text}</p>
                  ))}
                  {section.items ? (
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-[#2F3F35] marker:text-[#457D00]">
                      {section.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  ) : null}
                </section>
              ))}

              <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-agrivive-border pt-6 text-sm">
                {otherPages.filter((page) => page.href !== path).map((page) => (
                  <Link key={page.href} href={page.href} className="font-semibold text-[#457D00] hover:underline">
                    {page.label}
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </PageContainer>
      </main>
      <HomeFooter />
    </>
  );
}
