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
    <nav aria-label="Filter orders by status" className="flex max-w-full overflow-x-auto no-scrollbar">
      <div className="inline-flex items-center gap-1 rounded-full bg-[#F5F6EE] p-1.5 border border-[#EAECE0]">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                active
                  ? "bg-white text-[#202E1B] shadow-2xs"
                  : "text-[#7A8875] hover:text-[#202E1B]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`inline-flex size-[22px] shrink-0 items-center justify-center rounded-full text-xs font-bold leading-none ${
                  active
                    ? "bg-[#D2E794] text-[#244218]"
                    : "bg-[#EAECE0] text-[#7A8875]"
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
