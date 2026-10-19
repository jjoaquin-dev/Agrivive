import type { StakeholderSummary } from "@/src/features/stakeholder/api/summary";

interface Props {
  data: StakeholderSummary;
}

export const StakeholderPrintLayoutComponent = ({ data }: Props) => {
  return (
    <div className="hidden text-black print:block print:p-6">
      <div className="border-b-2 border-black pb-4 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Republic of the Philippines</p>
        <p className="text-xs uppercase text-gray-700">City Government of Davao</p>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-black">AGRIVIVE PUBLIC MARKETPLACE MONITORING REPORT</h1>
        <p className="mt-1 text-xs text-gray-800">
          City Agriculturist&apos;s Office (CAO) &bull; City Economic Enterprises Office (CEEO)
        </p>
        <p className="mt-1 text-[10px] text-gray-600">
          Snapshot: {new Date(data.generatedAt).toLocaleString()} &bull; Doc Ref: AGRIVIVE-MKT-STAT
        </p>
      </div>

      <div className="mt-6">
        <h2 className="border-b border-gray-400 pb-1 text-sm font-bold uppercase text-black">1. Executive Summary & Scale</h2>
        <table className="mt-2 w-full text-xs">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-1.5 font-medium text-gray-700">Registered Farmers / Stall Vendors:</td>
              <td className="py-1.5 font-bold text-right text-black">{data.users.sellers}</td>
              <td className="py-1.5 pl-6 font-medium text-gray-700">Active Surplus Listings:</td>
              <td className="py-1.5 font-bold text-right text-black">{data.listings.active}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-1.5 font-medium text-gray-700">Registered Consumers / Buyers:</td>
              <td className="py-1.5 font-bold text-right text-black">{data.users.buyers}</td>
              <td className="py-1.5 pl-6 font-medium text-gray-700">Completed Rescues (Verified):</td>
              <td className="py-1.5 font-bold text-right text-black">{data.orders.completed ?? 0}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-1.5 font-medium text-gray-700">Rescue Fulfillment Rate:</td>
              <td className="py-1.5 font-bold text-right text-black">{data.rescueMetrics.fulfillmentRate}%</td>
              <td className="py-1.5 pl-6 font-medium text-gray-700">Total Rescued Volume:</td>
              <td className="py-1.5 font-bold text-right text-black">{data.rescueMetrics.totalRescuedQty.toLocaleString()} units</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h2 className="border-b border-gray-400 pb-1 text-sm font-bold uppercase text-black">2. Crop Category Surplus Breakdown</h2>
        <table className="mt-2 w-full text-xs">
          <thead>
            <tr className="border-b border-gray-400 text-left font-bold text-black">
              <th className="py-1">Agricultural Category</th>
              <th className="py-1 text-right">Active Surplus Count</th>
            </tr>
          </thead>
          <tbody>
            {data.cropCategories.map((c) => (
              <tr key={c.category} className="border-b border-gray-100">
                <td className="py-1 text-gray-800">{c.category}</td>
                <td className="py-1 text-right font-semibold text-black">{c.activeCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h2 className="border-b border-gray-400 pb-1 text-sm font-bold uppercase text-black">3. Order Lifecycle Status</h2>
        <table className="mt-2 w-full text-xs">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-1 font-medium text-gray-700">Completed & Verified:</td>
              <td className="py-1 font-bold text-right text-black">{data.orders.completed ?? 0}</td>
              <td className="py-1 pl-6 font-medium text-gray-700">Pending Pickup:</td>
              <td className="py-1 font-bold text-right text-black">{data.orders.pending ?? 0}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-1 font-medium text-gray-700">Expired Unclaimed (24h):</td>
              <td className="py-1 font-bold text-right text-black">{data.orders.expired ?? 0}</td>
              <td className="py-1 pl-6 font-medium text-gray-700">Cancelled Reservations:</td>
              <td className="py-1 font-bold text-right text-black">{data.orders.cancelled ?? 0}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 border-t border-gray-400 pt-4 text-[10px] text-gray-600">
        <p className="font-bold text-gray-800">Republic Act No. 10173 (Data Privacy Act of 2012) Compliance Statement:</p>
        <p>This report contains aggregated non-personally identifiable marketplace statistics pursuant to Agrivive System Specification Section 1.4 & 2.2.1. No individual buyer or vendor identities, contact numbers, or stall identifiers are disclosed.</p>
      </div>
    </div>
  );
};
