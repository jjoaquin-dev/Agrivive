import { Users, ShoppingBag, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StakeholderSummary } from "@/src/features/stakeholder/api/summary";

interface Props {
  data: StakeholderSummary;
}

export const StakeholderKpiGridComponent = ({ data }: Props) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Community Scale</CardTitle>
          <Users className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="font-heading text-3xl font-bold text-foreground">
            {data.users.sellers + data.users.buyers}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Stall Vendors: <strong className="text-foreground">{data.users.sellers}</strong></span>
            <span>Consumers: <strong className="text-foreground">{data.users.buyers}</strong></span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Surplus Volume</CardTitle>
          <ShoppingBag className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="font-heading text-3xl font-bold text-primary">{data.listings.active}</div>
          <p className="mt-2 text-xs text-muted-foreground">
            From {data.listings.total} total catalog varieties
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Completed Food Rescues</CardTitle>
          <CheckCircle2 className="size-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="font-heading text-3xl font-bold text-emerald-700">{data.orders.completed ?? 0}</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Rescued volume: <strong>{data.rescueMetrics.totalRescuedQty.toLocaleString()} units</strong>
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pickup Rescue Rate</CardTitle>
          <TrendingUp className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="font-heading text-3xl font-bold text-foreground">
            {data.rescueMetrics.fulfillmentRate}%
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Completed vs expired reservation ratio
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
