import Image from "next/image";

const testimonials = [
  {
    quote:
      "I bought 2 kilos of tomatoes and highland carrots for half the supermarket price. They made the most flavorful sinigang and tinola for my family. Perfectly fresh and crisp!",
    name: "Elena Marasigan",
    role: "Home Cook",
    location: "Matina, Davao City",
    avatar: "/avatars/elena.jpg",
  },
  {
    quote:
      "Before Agrivive, extra eggplants and squash at 5 PM would end up in the bin. Now buyers reserve them online and pick them up before closing. Zero waste for my stall.",
    name: "Mang Danilo Tan",
    role: "Stall Vendor",
    location: "Bankerohan Public Market",
    avatar: "/avatars/danilo.jpg",
  },
  {
    quote:
      "Running an eatery on a tight budget is tough. Reserving bulk cabbage and bell peppers through Agrivive saved us over ₱3,500 this month alone without compromising meal quality.",
    name: "Ate Grace Tolentino",
    role: "Carinderia Owner",
    location: "Agdao District, Davao City",
    avatar: "/avatars/grace.jpg",
  },
  {
    quote:
      "Harvesting excess produce used to mean taking painful losses on transport. Agrivive connects our mountain harvests directly with city buyers who truly appreciate wholesome food.",
    name: "Kuya Robert Singson",
    role: "Highland Grower",
    location: "Marilog District",
    avatar: "/avatars/robert.jpg",
  },
  {
    quote:
      "We prioritize seasonal freshness in our kitchen. Viewing live stall photos and reserving produce 24 hours in advance gives us reliable inventory and outstanding local produce.",
    name: "Chef Marcus Villanueva",
    role: "Restaurateur",
    location: "Poblacion, Davao City",
    avatar: "/avatars/marcus.jpg",
  },
  {
    quote:
      "The 24-hour QR pickup pass makes reservations foolproof. I reserved morning produce on my phone and picked it up in 5 minutes at the stall on my way home from work.",
    name: "Nanay Susan Bautista",
    role: "Neighborhood Cook",
    location: "Toril, Davao City",
    avatar: "/avatars/susan.jpg",
  },
];

export function HomeImpactTestimonials() {
  return (
    <section id="testimonials" className="bg-[#FAF9F5] py-16 sm:py-24 border-b border-neutral-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header (Matching First Photo) */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-[#F0F7ED] px-4 py-1.5 font-heading text-xs font-bold text-[#457D00] border border-[#457D00]/20">
            Testimonials
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="text-[#457D00]">Trusted by buyers &amp; growers</span>
            <span className="block text-neutral-900 mt-1">across Davao City</span>
          </h2>
          <p className="mt-4 text-sm text-neutral-600 sm:text-base leading-relaxed">
            Real experiences from home cooks, eatery owners, and local stall vendors reducing food waste and saving together.
          </p>
        </div>

        {/* 6 Clean Testimonial Cards in 2 Tiers */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-neutral-200/70 bg-white p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                {/* Large Green Quotation Mark (Matching Reference Photo) */}
                <svg
                  className="h-8 w-8 text-[#457D00]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-neutral-600">
                  “{item.quote}”
                </p>
              </div>

              {/* Author Footer: Avatar + Name + Role & Location */}
              <div className="mt-6 flex items-center gap-3.5 border-t border-neutral-100 pt-5">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  width={44}
                  height={44}
                  className="rounded-full object-cover border border-neutral-200"
                />
                <div className="flex flex-col">
                  <p className="font-heading text-sm font-bold text-neutral-900 group-hover:text-[#457D00] transition-colors">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {item.role} • {item.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
