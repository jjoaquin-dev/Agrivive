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
};

type MarketplaceFiltersProps = {
  values: MarketplaceFilterValues;
  onChange: (key: keyof MarketplaceFilterValues, value: string) => void;
  idPrefix: string;
};

const units: MarketplaceUnit[] = ["kilo", "pile", "sack"];
const sellerTypes: MarketplaceSellerType[] = ["supplier", "supplier_vendor", "retail_vendor"];
const selectClass = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

export function MarketplaceFilters({ values, onChange, idPrefix }: MarketplaceFiltersProps) {
  const fieldId = (name: string) => `${idPrefix}-${name}`;

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="mr-auto pb-1">
        <h2 className="font-heading text-sm font-semibold">Filter listings</h2>
        <p className="text-xs text-muted-foreground">Narrow by unit, seller, price, or amount.</p>
      </div>
      <Field className="min-w-36 flex-1">
        <FieldLabel htmlFor={fieldId("unit")} className="text-xs font-semibold">Selling unit</FieldLabel>
        <select id={fieldId("unit")} value={values.unit} onChange={(event) => onChange("unit", event.target.value)} className={selectClass}>
          <option value="">All units</option>
          {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
        </select>
      </Field>
      <Field className="min-w-40 flex-1">
        <FieldLabel htmlFor={fieldId("seller")} className="text-xs font-semibold">Seller type</FieldLabel>
        <select id={fieldId("seller")} value={values.sellerType} onChange={(event) => onChange("sellerType", event.target.value)} className={selectClass}>
          <option value="">All sellers</option>
          {sellerTypes.map((type) => <option key={type} value={type}>{sellerTypeLabel(type)}</option>)}
        </select>
      </Field>
      <FieldSet className="min-w-56 flex-[1.3] gap-1.5">
        <FieldLegend className="text-xs font-semibold">Price range (PHP)</FieldLegend>
        <div className="grid grid-cols-2 gap-2">
          <Input aria-label="Minimum price" type="number" min="0" step="0.01" placeholder="Min" value={values.minPrice} onChange={(event) => onChange("minPrice", event.target.value)} className="h-11 text-sm" />
          <Input aria-label="Maximum price" type="number" min="0" step="0.01" placeholder="Max" value={values.maxPrice} onChange={(event) => onChange("maxPrice", event.target.value)} className="h-11 text-sm" />
        </div>
      </FieldSet>
      <FieldSet className="min-w-56 flex-[1.3] gap-1.5">
        <FieldLegend className="text-xs font-semibold">Available quantity</FieldLegend>
        <div className="grid grid-cols-2 gap-2">
          <Input aria-label="Minimum quantity" type="number" min="0" step="0.01" placeholder="Min" value={values.minQuantity} onChange={(event) => onChange("minQuantity", event.target.value)} className="h-11 text-sm" />
          <Input aria-label="Maximum quantity" type="number" min="0" step="0.01" placeholder="Max" value={values.maxQuantity} onChange={(event) => onChange("maxQuantity", event.target.value)} className="h-11 text-sm" />
        </div>
      </FieldSet>
    </div>
  );
}
