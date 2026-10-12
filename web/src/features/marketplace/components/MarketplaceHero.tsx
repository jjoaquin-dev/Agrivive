import { FormEvent } from "react";
import Image from "next/image";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MarketplaceHeroProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function MarketplaceHero({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
}: MarketplaceHeroProps) {
  return (
    <section className="relative grid overflow-hidden rounded-[24px] border border-border/80 bg-white shadow-[0_12px_36px_rgba(31,77,58,0.07)] lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <h1 className="mt-5 max-w-xl font-heading text-3xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
          Fresh surplus produce,{" "}
          <span className="text-agrivive-primary">
            direct from local stalls.
          </span>
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
          Reserve available produce at Bankerohan, Agdao, and Toril before
          market close.
        </p>
        <form
          onSubmit={onSearchSubmit}
          className="mt-7 flex w-full max-w-xl flex-col gap-2 sm:flex-row"
          role="search"
        >
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="marketplace-search" className="sr-only">
              Search produce
            </label>
            <Input
              id="marketplace-search"
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              placeholder="Search produce"
              className="h-12 border-input bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-agrivive-primary/30"
            />
          </div>
          <Button type="submit" className="h-12 px-6">
            Search
          </Button>
        </form>
      </div>
      <div className="relative hidden min-h-[300px] overflow-hidden bg-agrivive-primary lg:block">
        <Image
          src="/brand/cute-veggies-market.jpg"
          alt="3D Nano Banana and cute vegetables at Davao Organic Harvest market"
          fill
          className="object-cover object-center"
          sizes="(min-width: 1024px) 40vw, 1px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-agrivive-primary/80 via-transparent to-black/10" />
        <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/30 bg-white/85 p-4 text-agrivive-text shadow-md backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-wider text-agrivive-primary">
            Fresh & Healthy Harvest
          </p>
          <p className="mt-0.5 font-heading text-base font-bold leading-tight">
            Good nutrition rescued directly from Davao market stalls.
          </p>
        </div>
      </div>
    </section>
  );
}
