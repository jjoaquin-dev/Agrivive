import { Banknote, UserPlus, Flag, PackageCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { StakeholderSummary } from "@/src/features/stakeholder/api/summary";

const peso = (n: number) => `₱${n.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

export const StakeholderHighlightsComponent = ({ data }: { data: StakeholderSummary }) => {
  const last7 = data.trends.daily.slice(-7);
  const prev7 = data.trends.daily.slice(-14, -7);
  const sum = (rows: typeof last7) => rows.reduce((a, d) => a + d.completed, 0);
  const now = sum(last7);
  const before = sum(prev7);
  const change = before > 0 ? Math.round(((now - before) / before) * 100) : null;
  const items = [
    { icon: Banknote, label: "Money Paid at Pickup", value: peso(data.trends.totalPesos), note: "All completed pickups" },
    { icon: PackageCheck, label: "Pickups This Week", value: String(now), note: change === null ? "No pickups the week before" : `${change >= 0 ? "Up" : "Down"} ${Math.abs(change)}% from last week` },
    { icon: UserPlus, label: "New Accounts, 30 Days", value: String(data.trends.newUsers30d), note: "Sellers and buyers who joined" },
    { icon: Flag, label: "Order Reports", value: String(data.reports.total), note: "Problems buyers or sellers reported" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, label, value, note }) => (
        <Card key={label} className="border-border bg-card shadow-sm">
          <CardContent className="flex items-start gap-3 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{note}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
