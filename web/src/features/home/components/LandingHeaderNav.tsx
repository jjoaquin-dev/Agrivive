"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "@/src/hooks/useActiveSection";

export type LandingSectionLink = { label: string; href: string; isRoute?: boolean };

const baseClass =
  "relative inline-flex min-h-9 items-center rounded-full px-3 transition-colors duration-200 hover:bg-[#457D00]/8 hover:text-[#457D00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00]";
const activeClass = "bg-[#457D00]/10 text-[#457D00]";

export function LandingHeaderNav({ links }: { links: LandingSectionLink[] }) {
  const pathname = usePathname();
  const active = useActiveSection(links.filter((l) => l.href.startsWith("#")).map((l) => l.href.slice(1)));

  return (
    <nav aria-label="Page sections" className="flex items-center gap-1 font-sans text-sm font-semibold text-neutral-600">
      {links.map((link) => {
        // Home is current only on "/" with no section in view; routes match their own path; anchors match the section in view
        const isCurrent = link.href === "/" ? pathname === "/" && active === null : link.href.startsWith("#") ? link.href === `#${active}` : link.href === pathname;
        const className = `${baseClass} ${isCurrent ? activeClass : ""}`;
        const content =
          link.href.endsWith("#live-inventory") ? (
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#008459] animate-pulse motion-reduce:animate-none" />
              <span>{link.label}</span>
            </span>
          ) : (
            link.label
          );

        return link.isRoute || link.href === "/" ? (
          <Link key={link.href} href={link.href} className={className} aria-current={isCurrent ? "page" : undefined}>
            {content}
          </Link>
        ) : (
          <a key={link.href} href={link.href} className={className} aria-current={isCurrent ? "location" : undefined}>
            {content}
          </a>
        );
      })}
    </nav>
  );
}
