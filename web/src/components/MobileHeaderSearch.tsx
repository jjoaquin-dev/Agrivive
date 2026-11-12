"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { buildHeaderSearchUrl, navCategories } from "./headerSearchUrl";

// Search bar at the top of the phone menu. The category is chosen from the list below it.
export function MobileHeaderSearch({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const search = searchParams?.get("search") ?? "";
  const productType = searchParams?.get("productType") ?? "";
  const category = navCategories.includes(productType) ? productType : "All Categories";
  const [query, setQuery] = useState(search);

  useEffect(() => setQuery(search), [search]);

  function submit(e: FormEvent) {
    e.preventDefault();
    router.push(buildHeaderSearchUrl(searchParams?.toString() ?? "", pathname.startsWith("/marketplace"), query, category));
    onDone();
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className="flex min-h-12 w-full items-center rounded-full border border-neutral-300 bg-neutral-50/70 p-1 pl-4 transition-all focus-within:border-agrivive-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-agrivive-primary/20"
    >
      <Search aria-hidden="true" className="size-4 shrink-0 text-neutral-500" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search vegetable name…"
        aria-label="Search vegetables"
        enterKeyHint="search"
        className="min-w-0 flex-1 border-none bg-transparent px-2.5 text-base text-neutral-800 shadow-none outline-none placeholder:text-neutral-500 focus:outline-none focus:ring-0"
      />
      <button type="submit" className="flex min-h-10 shrink-0 items-center rounded-full bg-agrivive-primary px-5 text-sm font-bold text-white transition-colors hover:bg-[#386400] active:scale-[0.97]">
        Search
      </button>
    </form>
  );
}
