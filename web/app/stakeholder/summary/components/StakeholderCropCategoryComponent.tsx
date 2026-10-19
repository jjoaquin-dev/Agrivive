import { Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CropCategoryBreakdown } from "@/src/features/stakeholder/api/summary";

interface Props {
  categories: CropCategoryBreakdown[];
}

export const StakeholderCropCategoryComponent = ({ categories }: Props) => {
  const total = categories.reduce((sum, c) => sum + c.activeCount, 0);

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Layers className="size-5 text-primary" />
          Crop Category Surplus Distribution
        </CardTitle>
        <CardDescription>
          Agricultural categories experiencing surplus supply across Davao market stalls
        </CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No active surplus listings recorded.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const pct = total > 0 ? Math.round((c.activeCount / total) * 100) : 0;
              return (
                <div key={c.category} className="rounded-xl border border-border bg-muted/20 p-3.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span>{c.category}</span>
                    <span className="text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="mt-2 font-heading text-2xl font-bold text-foreground">{c.activeCount}</div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
