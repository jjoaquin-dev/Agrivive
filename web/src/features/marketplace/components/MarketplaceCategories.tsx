import { categories } from "@/src/features/home/components/HomeCategories";
import { CategoryTile } from "@/src/components/CategoryTile";

// Same category cards as the landing page.
export function MarketplaceCategories() {
  return (
    <section>
      <h2 className="mb-4 font-heading text-lg font-bold tracking-tight text-[#14231A]">Browse Surplus Vegetables Categories</h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {categories.map((cat) => (
          <li key={cat.name}>
            <CategoryTile {...cat} />
          </li>
        ))}
      </ul>
    </section>
  );
}
