"use client";

import Image from "next/image";

interface MarketplaceCategory {
  name: string;
  type: string;
  count: string;
  image: string;
  gradient: string;
}

const marketplaceCategories: MarketplaceCategory[] = [
  {
    name: "Leafy Greens",
    type: "Leafy Greens",
    count: "48 items",
    image: "/categories/leafy-greens.png",
    gradient: "from-[#F2F8ED] to-[#E5F2DC]",
  },
  {
    name: "Fruit Veggies",
    type: "Fruit Vegetables",
    count: "36 items",
    image: "/categories/fruit-vegetables.png",
    gradient: "from-[#FDF6ED] to-[#FAECE0]",
  },
  {
    name: "Root Veggies",
    type: "Root Vegetables",
    count: "29 items",
    image: "/categories/root-vegetables.png",
    gradient: "from-[#FCF8E8] to-[#F8F0D0]",
  },
  {
    name: "Pod Veggies",
    type: "Pod Vegetables",
    count: "22 items",
    image: "/categories/pod-vegetables.png",
    gradient: "from-[#F0F7F2] to-[#E2EFE7]",
  },
  {
    name: "Tuber Veggies",
    type: "Tuber Vegetables",
    count: "18 items",
    image: "/categories/tuber-vegetables.png",
    gradient: "from-[#F8F4EE] to-[#EFE7DC]",
  },
  {
    name: "Bulb Veggies",
    type: "Bulb Vegetables",
    count: "15 items",
    image: "/categories/bulb-vegetables.png",
    gradient: "from-[#F9F4F7] to-[#F1E6ED]",
  },
];

export function MarketplaceCategories({
  selectedType,
  onSelectCategory,
}: {
  selectedType: string;
  onSelectCategory: (type: string) => void;
}) {
  return (
    <section>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#457D00]">
            Browse the harvest
          </p>
          <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-[#14231A]">
            Browse Surplus Vegetables
          </h2>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        {marketplaceCategories.map((cat) => {
          const isSelected = selectedType === cat.type;
          return (
            <button
              key={cat.type}
              type="button"
              onClick={() => onSelectCategory(isSelected ? "" : cat.type)}
              className={`group flex flex-col items-center rounded-[20px] border p-3.5 pb-4 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md bg-gradient-to-b ${cat.gradient} ${
                isSelected
                  ? "border-[#457D00] ring-2 ring-[#457D00]/25 shadow-sm"
                  : "border-neutral-200/80 shadow-2xs hover:border-neutral-300"
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-contain scale-115 transition-transform duration-300 group-hover:scale-125"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <div className="mt-2.5 flex flex-col items-center">
                <span className="text-xs font-bold text-[#14231A] transition-colors group-hover:text-[#457D00]">
                  {cat.name}
                </span>
                <span className="mt-0.5 text-[11px] font-medium text-[#5F7367]">
                  {cat.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
