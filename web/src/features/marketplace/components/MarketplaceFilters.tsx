import { Field, FieldLabel, FieldSet, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { MarketplaceSellerType, MarketplaceUnit } from "../types";
import { sellerTypeLabel } from "../marketplace-labels";

export type MarketplaceFilterValues = {
  productType: string;
  unit: string;
  sellerType: string;
  minPrice: string;
  maxPrice: string;
  minQuantity: string;
  maxQuantity: string;
  radiusKm: string;
};

type MarketplaceFiltersProps = {
  values: MarketplaceFilterValues;
  onChange: (key: keyof MarketplaceFilterValues, value: string) => void;
  idPrefix: string;
  hasLocation: boolean;
  locationStatus: "idle" | "loading" | "error";
  locationError: string;
  onUseLocation: () => void;
};

const units: MarketplaceUnit[] = ["kilo", "pile", "sack"];
const sellerTypes: MarketplaceSellerType[] = ["supplier", "supplier_vendor", "retail_vendor"];
const selectClass = "h-12 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground transition-colors focus-visible:border-agrivive-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

export function MarketplaceFilters({ values, onChange, idPrefix, hasLocation, locationStatus, locationError, onUseLocation }: MarketplaceFiltersProps) {
  const fieldId = (name: string) => `${idPrefix}-${name}`;

  return (
    <div className="grid gap-3 rounded-[20px] border border-border/80 bg-white/90 p-4 shadow-[0_8px_24px_rgba(31,77,58,0.04)] sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-[1.1fr_1fr_1fr_1.2fr_1.2fr_1.55fr] sm:p-5">
      <div className="pb-1">
        <h2 className="font-heading text-base font-bold">Filter listings</h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Narrow by unit, seller, price, or amount.</p>
      </div>
      <Field>
        <FieldLabel htmlFor={fieldId("unit")} className="text-xs font-semibold text-foreground/80">Selling unit</FieldLabel>
        <select id={fieldId("unit")} value={values.unit} onChange={(event) => onChange("unit", event.target.value)} className={selectClass}>
          <option value="">All units</option>
          {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
        </select>
      </Field>
      <Field>
        <FieldLabel htmlFor={fieldId("seller")} className="text-xs font-semibold text-foreground/80">Seller type</FieldLabel>
        <select id={fieldId("seller")} value={values.sellerType} onChange={(event) => onChange("sellerType", event.target.value)} className={selectClass}>
          <option value="">All sellers</option>
          {sellerTypes.map((type) => <option key={type} value={type}>{sellerTypeLabel(type)}</option>)}
        </select>
      </Field>
      <FieldSet className="gap-1.5">
        <FieldLegend className="text-xs font-semibold text-foreground/80">Price range (PHP)</FieldLegend>
        <div className="grid grid-cols-2 gap-2">
          <Input aria-label="Minimum price" type="number" min="0" step="0.01" placeholder="Min" value={values.minPrice} onChange={(event) => onChange("minPrice", event.target.value)} className="h-11 text-sm" />
          <Input aria-label="Maximum price" type="number" min="0" step="0.01" placeholder="Max" value={values.maxPrice} onChange={(event) => onChange("maxPrice", event.target.value)} className="h-11 text-sm" />
        </div>
      </FieldSet>
      <FieldSet className="gap-1.5">
        <FieldLegend className="text-xs font-semibold text-foreground/80">Available quantity</FieldLegend>
        <div className="grid grid-cols-2 gap-2">
          <Input aria-label="Minimum quantity" type="number" min="0" step="0.01" placeholder="Min" value={values.minQuantity} onChange={(event) => onChange("minQuantity", event.target.value)} className="h-11 text-sm" />
          <Input aria-label="Maximum quantity" type="number" min="0" step="0.01" placeholder="Max" value={values.maxQuantity} onChange={(event) => onChange("maxQuantity", event.target.value)} className="h-11 text-sm" />
        </div>
      </FieldSet>
      <FieldSet className="gap-1.5">
        <FieldLegend className="text-xs font-semibold text-foreground/80">Nearby pickup</FieldLegend>
        <div className="grid grid-cols-[minmax(0,1fr)_7rem] gap-2">
          <button type="button" onClick={onUseLocation} disabled={locationStatus === "loading"} className="min-h-12 whitespace-nowrap rounded-xl border border-agrivive-primary bg-white px-3 text-sm font-semibold text-agrivive-primary transition-[background-color,transform] hover:bg-agrivive-primary/5 active:translate-y-px disabled:cursor-wait disabled:opacity-60">
            {locationStatus === "loading" ? "Finding you…" : hasLocation ? "Update location" : "Use my location"}
          </button>
          <select aria-label="Nearby radius" value={values.radiusKm} onChange={(event) => onChange("radiusKm", event.target.value)} disabled={!hasLocation} className={selectClass}>
            <option value="10">10 km</option>
            <option value="5">5 km</option>
            <option value="25">25 km</option>
            <option value="50">50 km</option>
          </select>
        </div>
        {locationError ? <p className="text-xs leading-5 text-destructive" role="alert">{locationError}</p> : <p className="text-xs leading-5 text-muted-foreground">Use your location to find nearby stalls.</p>}
      </FieldSet>
    </div>
  );
}
