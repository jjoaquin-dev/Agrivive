"use client";

import { Clock3, Package, ShoppingBag, XCircle } from "lucide-react";

export type OrderTab = "all" | "pending" | "completed" | "archived";

interface OrderFilterTabsProps {
  activeTab: OrderTab;
  onTabChange: (tab: OrderTab) => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
    archived: number;
  };
}

export function OrderFilterTabs({ activeTab, onTabChange, counts }: OrderFilterTabsProps) {
  const tabs = [
    { id: "all" as const, label: "All order", count: counts.all, icon: ShoppingBag },
    { id: "pending" as const, label: "Processing", count: counts.pending, icon: Clock3 },
    { id: "completed" as const, label: "Completed", count: counts.completed, icon: Package },
    { id: "archived" as const, label: "Canceled", count: counts.archived, icon: XCircle },
  ];

  return (
    <nav aria-label="Filter orders by status" className="mb-5 flex border-b border-border/80 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative inline-flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition-colors ${
              active
                ? "border-agrivive-primary text-agrivive-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            <span>{tab.label} ({tab.count})</span>
          </button>
        );
      })}
    </nav>
  );
}
