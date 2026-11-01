import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { label: string; href?: string };

// Top-left trail on inner pages. The last item is the current page and is not a link.
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-neutral-500">
        <li>
          <Link href="/" className="transition-colors hover:text-[#457D00]">Home</Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-neutral-400" />
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-[#457D00]">{item.label}</Link>
              ) : (
                <span aria-current="page" className="truncate font-semibold text-neutral-800">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
