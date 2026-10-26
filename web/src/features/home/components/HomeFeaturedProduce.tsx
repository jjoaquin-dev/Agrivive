import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  HomeFeaturedProduceCard,
  type FeaturedProduceItem,
} from "./HomeFeaturedProduceCard";

const liveOfferings: FeaturedProduceItem[] = [
  {
    id: "prod-1",
    name: "Sun-Freckled Native Tomatoes",
    category: "Fruit Vegetables",
    originalPrice: "₱80",
    surplusPrice: "₱40",
    unit: "kilo",
    quantity: "14 kilos left",
    discount: "50% OFF",
    stall: "Bankerohan Market",
    image: "/produce/native-tomatoes.jpg",
  },
  {
    id: "prod-2",
    name: "Curved Highland Carrots",
    category: "Root Vegetables",
    originalPrice: "₱65",
    surplusPrice: "₱35",
    unit: "pile",
    quantity: "8 piles left",
    discount: "46% OFF",
    stall: "Marilog Farm Direct",
    image: "/produce/highland-carrots.jpg",
  },
  {
    id: "prod-3",
    name: "Glossy Purple Eggplant",
    category: "Fruit Vegetables",
    originalPrice: "₱800",
    surplusPrice: "₱450",
    unit: "sack",
    quantity: "5 sacks left",
    discount: "44% OFF",
    stall: "Agdao Public Market",
    image: "/produce/purple-eggplant.jpg",
  },
  {
    id: "prod-4",
    name: "Native Green Ampalaya",
    category: "Fruit Vegetables",
    originalPrice: "₱55",
    surplusPrice: "₱30",
    unit: "pile",
    quantity: "12 piles left",
    discount: "45% OFF",
    stall: "Toril Farm Direct",
    image: "/produce/green-ampalaya.jpg",
  },
];

export function HomeFeaturedProduce() {
  return (
    <section id="live-inventory" className="bg-[#FAF9F5] py-16 sm:py-20 border-b border-neutral-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-[#457D00] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#457D00]">
                Live Inventory
              </span>
            </div>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Freshly Rescued Today
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Wholesome produce available right now across Davao with verified price savings.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#457D00] hover:text-[#386600]"
          >
            See all available produce <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* 4 Clean Modern Cards with Canonical Selling Units */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {liveOfferings.map((item) => (
            <HomeFeaturedProduceCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
