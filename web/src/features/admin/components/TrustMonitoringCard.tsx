import { Info, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminPerformance } from "../api/performance";

export function TrustMonitoringCard({ monitoring, actions }: { monitoring: AdminPerformance["trustMonitoring"]; actions: AdminPerformance["trustActions"] }) {
  const metrics = [
    { label: "Monitoring points", value: monitoring.weightedPoints },
    { label: "Verified event points", value: monitoring.verifiedEventPoints },
    { label: "Low-rating signals", value: monitoring.ratingSignals },
    { label: "Written feedback", value: monitoring.writtenFeedbackCount },
    { label: "Unverified reports", value: monitoring.allegationFlags },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="size-5 text-primary" />Trust monitoring
        </CardTitle>
        <CardDescription className="flex items-start gap-1.5 pt-1 text-xs">
          <Info className="mt-0.5 size-4 shrink-0" />
          <span>Verified events and low ratings create monitoring points. Written feedback is context; unverified reports add no points. This view is read only; the system creates actions automatically only when the prototype policy is enabled.</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-border bg-muted/20 p-3">
              <span className="text-xs text-muted-foreground">{metric.label}</span>
              <p className="font-heading text-xl font-bold tabular-nums text-primary">{metric.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-agrivive-background/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">Active trust actions</p>
              <p className="text-xs text-muted-foreground">Policy {actions.policyVersion} · {actions.enabled ? "enabled" : "disabled"}</p>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">Admin view only</span>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            {[
              ["Warnings", actions.active.warning],
              ["Temporary restrictions", actions.active.temporaryRestriction],
              ["Blocked accounts", actions.active.blocked],
              ["Total active", actions.active.total],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border bg-white p-3">
                <span className="text-xs text-muted-foreground">{label}</span>
                <p className="mt-1 text-lg font-bold tabular-nums text-primary">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Thresholds: warning {actions.thresholds.warning} points · restriction {actions.thresholds.restriction} points · blocked {actions.thresholds.blocked} points. Admins cannot change, revoke, or restore these actions.
          </p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-muted/50 font-semibold text-muted-foreground">
              <tr><th className="p-3">Signal</th><th className="p-3 text-right">Count</th>
                <th className="p-3 text-right">Weight</th><th className="p-3 text-right">Points</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monitoring.components.map((component) => (
                <tr key={component.kind}>
                  <td className="p-3 font-medium capitalize">{component.kind.replaceAll("_", " ")}</td>
                  <td className="p-3 text-right tabular-nums">{component.count}</td>
                  <td className="p-3 text-right tabular-nums">{component.weight}×</td>
                  <td className="p-3 text-right font-semibold tabular-nums text-primary">{component.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
