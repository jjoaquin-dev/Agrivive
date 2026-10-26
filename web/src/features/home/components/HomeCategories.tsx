import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Leafy Greens",
    href: "/marketplace?productType=Leafy+Greens",
    image: "/categories/leafy-greens.png",
    alt: "Fresh leafy greens including bok choy, lettuce, and water spinach",
    topGradient: "from-[#EAF7E1]/90 via-[#F4FBEF]/40 to-transparent",
    hoverBorder: "hover:border-[#CFECC0]",
    shadow: "hover:shadow-[#457D00]/10",
  },
  {
    name: "Fruit Vegetables",
    href: "/marketplace?productType=Fruit+Vegetables",
    image: "/categories/fruit-vegetables.png",
    alt: "Fresh fruit vegetables including tomatoes, eggplant, and squash",
    topGradient: "from-[#FEECE0]/90 via-[#FEF6F0]/40 to-transparent",
    hoverBorder: "hover:border-[#F7CDB5]",
    shadow: "hover:shadow-[#FEA938]/10",
  },
  {
    name: "Root Vegetables",
    href: "/marketplace?productType=Root+Vegetables",
    image: "/categories/root-vegetables.png",
    alt: "Fresh root vegetables including carrots, radish, and beetroot",
    topGradient: "from-[#FEF0D8]/90 via-[#FFF8EC]/40 to-transparent",
    hoverBorder: "hover:border-[#F8D8B0]",
    shadow: "hover:shadow-[#E07A5F]/10",
  },
  {
    name: "Pod Vegetables",
    href: "/marketplace?productType=Pod+Vegetables",
    image: "/categories/pod-vegetables.png",
    alt: "Fresh pod vegetables including okra, string beans, and snap peas",
    topGradient: "from-[#E7F8DC]/90 via-[#F3FCEF]/40 to-transparent",
    hoverBorder: "hover:border-[#C5E8B2]",
    shadow: "hover:shadow-[#457D00]/10",
  },
  {
    name: "Tuber Vegetables",
    href: "/marketplace?productType=Tuber+Vegetables",
    image: "/categories/tuber-vegetables.png",
    alt: "Fresh tuber vegetables including potatoes, ube yam, and taro",
    topGradient: "from-[#F2EBFE]/90 via-[#F9F5FF]/40 to-transparent",
    hoverBorder: "hover:border-[#DDCFF5]",
    shadow: "hover:shadow-[#7C3AED]/10",
  },
  {
    name: "Bulb Vegetables",
    href: "/marketplace?productType=Bulb+Vegetables",
    image: "/categories/bulb-vegetables.png",
    alt: "Fresh bulb vegetables including onions, garlic, and scallions",
    topGradient: "from-[#FEF4DC]/90 via-[#FFF9EC]/40 to-transparent",
    hoverBorder: "hover:border-[#F6DCB2]",
    shadow: "hover:shadow-[#D97706]/10",
  },
];

export function HomeCategories() {
  return (
    <section id="categories" className="bg-[#FAF9F5] py-14 sm:py-20 border-y border-neutral-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
            Our Popular Categories
          </h2>
          <p className="mt-2.5 text-xs text-neutral-600 sm:text-sm md:text-base">
            Browse rescued surplus harvest by category directly from Davao partner farms and public stalls.
          </p>
        </div>

        {/* Clean Modern Categories Row */}
        <div className="mt-8 sm:mt-10 flex gap-3.5 sm:gap-5 overflow-x-auto scrollbar-none py-3 px-1 sm:justify-center snap-x snap-mandatory">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`group relative flex flex-col items-center justify-between shrink-0 w-[145px] sm:w-[160px] md:w-[172px] h-[185px] sm:h-[200px] rounded-[24px] bg-white p-3.5 sm:p-4 border border-neutral-200/70 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-1.5 hover:shadow-lg ${cat.hoverBorder} ${cat.shadow} transition-all duration-300 snap-start select-none overflow-hidden`}
            >
              {/* Subtle Upper Gradient Wash (Top until the middle, fades to transparent) */}
              <div
                className={`absolute top-0 inset-x-0 h-32 rounded-t-[24px] bg-gradient-to-b ${cat.topGradient} pointer-events-none`}
              />

              {/* Centered Produce Photography (Guaranteed Visible Dimensions) */}
              <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mt-1">
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  width={128}
                  height={128}
                  className="h-full w-full object-contain drop-shadow-sm transition-transform duration-300 ease-out group-hover:scale-108"
                />
              </div>

              {/* Category Name on Crisp White Surface */}
              <span className="relative z-10 font-heading text-xs sm:text-sm md:text-[15px] font-bold text-neutral-900 text-center group-hover:text-[#457D00] transition-colors mb-0.5 line-clamp-1 tracking-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
