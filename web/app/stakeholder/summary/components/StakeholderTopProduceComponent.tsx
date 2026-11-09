import { Sprout } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StakeholderTrends } from "@/src/features/stakeholder/api/summary";

/** The produce picked up most across all stalls, with the money it brought in. */
export const StakeholderTopProduceComponent = ({ items }: { items: StakeholderTrends["topProduce"] }) => {
  const max = Math.max(...items.map((i) => i.quantity), 1);
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold"><Sprout className="size-5 text-primary" />Most Rescued Produce</CardTitle>
        <CardDescription>Produce picked up the most across all stalls, from first place down.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">No completed pickups yet.</p> : (
          <ol className="space-y-3">
            {items.map((item, i) => (
              <li key={item.name}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-semibold text-foreground">{i + 1}. {item.name}</span>
                  <span className="shrink-0 text-muted-foreground">{item.quantity.toLocaleString("en-PH", { maximumFractionDigits: 1 })} picked up · ₱{item.pesos.toLocaleString("en-PH", { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-border"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(3, (item.quantity / max) * 100)}%` }} /></div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
};
