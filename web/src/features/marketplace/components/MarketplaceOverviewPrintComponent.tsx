import type { MarketplaceOverviewResponse } from "../api/overview";

interface Props {
  data: MarketplaceOverviewResponse;
}

export const MarketplaceOverviewPrintComponent = ({ data }: Props) => {
  const formattedDate = new Date(data.generatedAt).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="hidden print:block p-8 font-sans text-neutral-900 bg-white">
      {/* Official Header */}
      <div className="border-b-2 border-neutral-900 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900">
              Agrivive Marketplace Overview & Planning Report
            </h1>
            <p className="text-xs text-neutral-600 mt-1">
              Public Agricultural Food Rescue, Market Trends & Supply Analytics — Davao City Network
            </p>
          </div>
          <div className="text-right text-xs text-neutral-600">
            <p className="font-bold">Generated: {formattedDate}</p>
            <p className="capitalize">Reporting Scope: {data.range}ly Aggregate</p>
          </div>
        </div>
      </div>

      {/* KPI Summary Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border border-neutral-300 p-3 rounded-lg">
          <p className="text-[10px] font-bold uppercase text-neutral-500">Total Food Rescued</p>
          <p className="text-xl font-black mt-1">{data.kpis.totalRescuedQty.toLocaleString()} kg</p>
        </div>
        <div className="border border-neutral-300 p-3 rounded-lg">
          <p className="text-[10px] font-bold uppercase text-neutral-500">Active Surplus Listings</p>
          <p className="text-xl font-black mt-1">{data.kpis.activeListings}</p>
        </div>
        <div className="border border-neutral-300 p-3 rounded-lg">
          <p className="text-[10px] font-bold uppercase text-neutral-500">Pickup Fulfillment Rate</p>
          <p className="text-xl font-black mt-1">{data.kpis.fulfillmentRate}%</p>
        </div>
        <div className="border border-neutral-300 p-3 rounded-lg">
          <p className="text-[10px] font-bold uppercase text-neutral-500">Participating Stalls & Buyers</p>
          <p className="text-xl font-black mt-1">{data.kpis.activeSellers + data.kpis.activeBuyers}</p>
        </div>
      </div>

      {/* Top 10 Produce Table */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-neutral-200 pb-1">
          Top 10 Most Purchased Produce Items ({data.range})
        </h2>
        <table className="w-full text-left text-xs border border-neutral-200">
          <thead className="bg-neutral-100 font-bold border-b border-neutral-200">
            <tr>
              <th className="p-2 border-r border-neutral-200">Rank</th>
              <th className="p-2 border-r border-neutral-200">Produce Name</th>
              <th className="p-2 border-r border-neutral-200">Category</th>
              <th className="p-2 border-r border-neutral-200 text-right">Volume Rescued</th>
              <th className="p-2 border-r border-neutral-200 text-right">Orders</th>
              <th className="p-2 text-right">Estimated Value</th>
            </tr>
          </thead>
          <tbody>
            {data.topProduce.map((item, idx) => (
              <tr key={item.id} className="border-b border-neutral-200 even:bg-neutral-50/50">
                <td className="p-2 border-r border-neutral-200 font-bold">#{idx + 1}</td>
                <td className="p-2 border-r border-neutral-200 font-semibold">{item.name}</td>
                <td className="p-2 border-r border-neutral-200 text-neutral-600">{item.category}</td>
                <td className="p-2 border-r border-neutral-200 text-right font-bold">{item.totalQuantity} {item.unit}</td>
                <td className="p-2 border-r border-neutral-200 text-right">{item.orderCount}</td>
                <td className="p-2 text-right font-bold">₱{item.totalValue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category Breakdown Table */}
      <div className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b border-neutral-200 pb-1">
          Surplus Inventory Category Distribution
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {data.categoryBreakdown.map((c) => (
            <div key={c.category} className="border border-neutral-200 p-2.5 rounded flex justify-between text-xs">
              <span className="font-bold">{c.category}</span>
              <span>{c.activeCount} active listings ({c.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Document Footer */}
      <div className="border-t border-neutral-400 pt-3 text-[10px] text-neutral-500 flex justify-between">
        <span>Agrivive Open Agricultural Intelligence Platform</span>
        <span>Verified Public Overview Record</span>
      </div>
    </div>
  );
};
