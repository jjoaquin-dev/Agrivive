import { BarChart2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  orders: Record<string, number>;
  totalReports: number;
}

export const StakeholderOrderStatusComponent = ({ orders, totalReports }: Props) => {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <BarChart2 className="size-5 text-primary" />
          Marketplace Reservation Throughput
        </CardTitle>
        <CardDescription>
          Verification states of buyer reservations handled at participating city market stalls
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
              <CheckCircle2 className="size-4" /> Completed & Verified
            </div>
            <p className="mt-2 font-heading text-2xl font-bold text-emerald-900">{orders.completed ?? 0}</p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
              <Clock className="size-4" /> Pending Pickup
            </div>
            <p className="mt-2 font-heading text-2xl font-bold text-amber-900">{orders.pending ?? 0}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Clock className="size-4" /> Expired (24h Unclaimed)
            </div>
            <p className="mt-2 font-heading text-2xl font-bold text-foreground">{orders.expired ?? 0}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <AlertCircle className="size-4" /> Cancelled Reservations
            </div>
            <p className="mt-2 font-heading text-2xl font-bold text-foreground">{orders.cancelled ?? 0}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-muted/10 px-4 py-2.5 text-xs text-muted-foreground">
          <span>Quality Assurance: Recorded order dispute reports: <strong className="text-foreground">{totalReports}</strong></span>
          <span>Resolution status: Monitored</span>
        </div>
      </CardContent>
    </Card>
  );
};
