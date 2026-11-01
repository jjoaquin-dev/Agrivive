"use client";

export function ProfileNotificationsCard() {
  return (
    <div className="rounded-[20px] border border-neutral-200/80 bg-white p-6 shadow-[0_10px_28px_rgba(31,77,58,0.05)]">
      <div className="border-b border-border/70 pb-4">
        <h2 className="font-heading text-lg font-bold text-neutral-900">Pickup &amp; Restock Notifications</h2>
        <p className="text-sm text-neutral-500">
          Receive SMS or push alerts when fresh surplus from followed stalls arrives.
        </p>
      </div>
      <div className="mt-5 space-y-3">
        <label className="flex items-center gap-3 text-sm text-neutral-900">
          <input type="checkbox" defaultChecked className="size-4 accent-[#386600]" />
          <span>SMS alert when my reservation is ready for pickup</span>
        </label>
        <label className="flex items-center gap-3 text-sm text-neutral-900">
          <input type="checkbox" defaultChecked className="size-4 accent-[#386600]" />
          <span>Email notifications for surplus discount alerts (30%+ off)</span>
        </label>
      </div>
    </div>
  );
}
