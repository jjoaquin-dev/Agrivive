import Image from "next/image";
import Link from "next/link";

export type CategoryTileProps = {
  name: string;
  href: string;
  image: string;
  alt: string;
  topGradient: string;
  hoverBorder: string;
  imageScale?: string;
};

// One category card, shared by the landing page and the marketplace.
export function CategoryTile({ name, href, image, alt, topGradient, hoverBorder, imageScale }: CategoryTileProps) {
  return (
    <Link
      href={href}
      className={`group relative flex aspect-[4/5] flex-col items-center justify-between overflow-hidden rounded-2xl border border-neutral-200/70 bg-[#F4F7EE] p-4 transition-[transform,border-color,box-shadow] duration-200 ease-settle hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#457D00] focus-visible:ring-offset-2 ${hoverBorder}`}
    >
      {/* Soft wash behind the produce */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b ${topGradient}`} />

      <div className={`relative z-10 w-full flex-1 ${imageScale ?? ""}`}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 170px, (min-width: 640px) 30vw, 45vw"
          className="object-contain p-1 drop-shadow-sm transition-transform duration-500 ease-settle group-hover:scale-105"
        />
      </div>

      <span className="relative z-10 mt-2 text-center font-heading text-sm font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-[#457D00] sm:text-[15px]">
        {name}
      </span>
    </Link>
  );
}
