"use client";

export function ProfileNotificationsCard() {
  return (
    <div className="rounded-[24px] border border-border/80 bg-white p-6 shadow-xs sm:p-8">
      <h3 className="font-heading text-base font-bold">Pickup & Restock Notifications</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Receive SMS or push alerts when fresh surplus from followed stalls arrives.
      </p>
      <div className="mt-5 space-y-3">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" defaultChecked className="size-4 rounded text-agrivive-primary" />
          <span>SMS alert when my reservation is ready for pickup</span>
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" defaultChecked className="size-4 rounded text-agrivive-primary" />
          <span>Email notifications for surplus discount alerts (30%+ off)</span>
        </label>
      </div>
    </div>
  );
}
