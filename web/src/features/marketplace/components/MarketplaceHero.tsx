import { FormEvent } from "react";
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
    <section className="relative overflow-hidden rounded-2xl border border-border bg-white px-5 py-7 shadow-xs sm:px-8 sm:py-9">
      {/* Subtle decorative leaf accent */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-agrivive-primary/5 blur-2xl" />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-agrivive-sage/40 bg-agrivive-background px-3 py-1 text-xs font-semibold text-agrivive-primary">
            <MapPin className="size-3.5 text-agrivive-primary" />
            <span>Davao City Public Markets · Same-day Pickup</span>
          </div>
          <h1 className="mt-2.5 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Fresh surplus produce, <br className="hidden sm:inline" />
            <span className="text-agrivive-primary">direct from local market stalls</span>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Reserve available produce at Bankerohan, Agdao, and Toril before market close.
          </p>
        </div>

        {/* Prominent Storefront Search Field */}
        <form
          onSubmit={onSearchSubmit}
          className="flex w-full max-w-md items-center gap-2"
          role="search"
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <label htmlFor="marketplace-search" className="sr-only">
              Search produce or seller
            </label>
            <Input
              id="marketplace-search"
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              placeholder="Search produce or market stall…"
            className="h-12 border-input bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-agrivive-primary/30"
            />
          </div>
          <Button type="submit" className="h-12 px-5">
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}
