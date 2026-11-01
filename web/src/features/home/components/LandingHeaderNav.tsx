"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type LandingSectionLink = { label: string; href: string; isRoute?: boolean; group?: "page" | "section" };

const baseClass =
  "relative inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-2.5 transition-[background-color,color,transform] duration-200 hover:bg-[#457D00]/8 hover:text-[#457D00] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00] xl:px-3.5";
const activeClass = "bg-[#457D00]/12 text-[#457D00] shadow-md";

export function LandingHeaderNav({ links }: { links: LandingSectionLink[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Page sections" className="flex items-center gap-0.5 font-body text-[13px] font-semibold xl:text-sm text-neutral-600">
      {links.map((link, i) => {
        const startsSections = link.group === "section" && links[i - 1]?.group === "page";
        // Only page links show a current state; section links are tracked by the scroll progress bar
        const isCurrent = link.href === pathname;
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

        const item =
          link.isRoute || link.href === "/" ? (
            <Link href={link.href} className={className} aria-current={isCurrent ? "page" : undefined}>
              {content}
            </Link>
          ) : (
            <a href={link.href} className={className} >
              {content}
            </a>
          );

        return (
          <Fragment key={link.href}>
            {startsSections && <span aria-hidden="true" className="mx-1.5 h-5 w-px bg-neutral-200 xl:mx-2.5" />}
            {item}
          </Fragment>
        );
      })}
    </nav>
  );
}
