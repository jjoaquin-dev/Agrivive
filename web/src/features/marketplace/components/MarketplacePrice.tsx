type MarketplacePriceProps = {
  basePrice?: string | number | null;
  currentPrice: string | number;
  unit: string;
  size?: "card" | "detail";
};

function money(value: string | number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(value));
}

export function MarketplacePrice({
  basePrice,
  currentPrice,
  unit,
  size = "card",
}: MarketplacePriceProps) {
  const previousPrice = basePrice == null ? null : Number(basePrice);
  const isReduced = previousPrice !== null && previousPrice > Number(currentPrice);
  const priceSize = size === "detail" ? "text-3xl" : "text-base font-bold sm:text-lg";
  const oldPriceSize = size === "detail" ? "text-base" : "text-xs";
  const unitSize = size === "detail" ? "text-sm" : "text-xs";

  return (
    <div
      role="group"
      className="flex flex-wrap items-baseline gap-x-1.5"
      aria-label={
        isReduced
          ? `Was ${money(previousPrice!)}, now ${money(currentPrice)} per ${unit}`
          : `${money(currentPrice)} per ${unit}`
      }
    >
      {isReduced ? (
        <>
          <del className={`${oldPriceSize} text-muted-foreground`}>{money(previousPrice!)}</del>
          <span aria-hidden="true" className="text-muted-foreground text-xs">→</span>
        </>
      ) : null}
      <span className={`font-heading ${priceSize} text-primary`}>
        {money(currentPrice)}
      </span>
      <span className={`${unitSize} text-muted-foreground`}>/{unit}</span>
    </div>
  );
}
