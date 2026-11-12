"use client";

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
    { id: "all" as const, label: "All Orders", count: counts.all },
    { id: "pending" as const, label: "Processing", count: counts.pending },
    { id: "completed" as const, label: "Completed", count: counts.completed },
    { id: "archived" as const, label: "Canceled", count: counts.archived },
  ];

  return (
    <nav aria-label="Filter orders by status" className="max-w-full">
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-agrivive-line bg-agrivive-wash p-1.5 sm:inline-flex sm:items-center sm:rounded-full">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm sm:px-4 font-semibold transition-all cursor-pointer ${
                active
                  ? "bg-white text-agrivive-forest shadow-sm"
                  : "text-agrivive-gray hover:text-agrivive-forest"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`inline-flex size-[22px] shrink-0 items-center justify-center rounded-full text-xs font-bold leading-none ${
                  active
                    ? "bg-[#D2E794] text-agrivive-forest"
                    : "bg-agrivive-line text-agrivive-gray"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
